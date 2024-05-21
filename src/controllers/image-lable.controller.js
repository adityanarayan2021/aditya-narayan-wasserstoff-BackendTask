const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const logger = require("../config/logger");
const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const { aws } = require("../config/config");
const Label = require("../models/image-lable.model");
const fs = require('fs');
const uploadImageToS3 = require("../services/image.upload");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const credentials = {
  accessKeyId: aws.accessKeyId,
  secretAccessKey: aws.secretKey,
};

const rekognition = new RekognitionClient({region: aws.region, credentials });

const imageLabeling = catchAsync(async (req, res) => {
  try {
    const imageData = req.file.buffer;
    const imageUrl = await uploadImageToS3(req.file);
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: Buffer.from(imageData, "base64"),
      },
    });

    const response = await rekognition.send(command);
    const labels = response.Labels.map((label) => ({
      name: label.Name,
      confidence: label.Confidence,
    }));

    const imageWithLabels = {
      imageName: req.file.originalname,
      labels: labels,
      imageUrl: imageUrl,
    };

    await Label.create(imageWithLabels);

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    logger.error(`Error in image labeling ${err}`);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `Error ${err}` });
  }
});


const updateImageStatus = catchAsync(async (req, res) => {
  try {
    const { imageId } = req.params;
    const { status } = req.body;

    const allowedStatus = ['review', 'approved', 'rejected'];
    if (!allowedStatus.includes(status.toLowerCase())) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid status' });
    }

    const updatedImage = await Label.findByIdAndUpdate(imageId, { status: status.toLowerCase() }, { new: true });

    if (!updatedImage) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Image not found' });
    }

    res.status(httpStatus.OK).json({ msg: 'Image status updated successfully' });
  } catch (error) {
    logger.error(`Error updating image status: ${error}`);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update image status' });
  }
});


const exportDataInCsv = catchAsync(async (req, res) => {
  try {
    const approvedAnnotations = await Label.find({ status: 'approved' });

    const csvData = approvedAnnotations.map(annotation => ({
      ImageName: annotation.imageName,
      Labels: annotation.labels.map(label => `${label.name} (${label.confidence})`).join(', '),
      status: annotation.status,
    }));
    const csvWriter = createCsvWriter({
      path: 'approved_annotations.csv',
      header: [
        { id: 'ImageName', title: 'Image_Name' },
        { id: 'Labels', title: 'Labels' },
        {id: 'status', title: 'status'}
      ]
    });

    await csvWriter.writeRecords(csvData);

    res.attachment('approved_annotations.csv');
    fs.createReadStream('approved_annotations.csv').pipe(res);
  } catch (error) {
    logger.error(`Error exporting CSV: ${error}`);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});


module.exports = {
    imageLabeling,
    exportDataInCsv,
    updateImageStatus,
}
