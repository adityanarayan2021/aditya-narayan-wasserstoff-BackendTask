const AWS = require('aws-sdk');
const { Readable } = require('stream');

const config = require('../config/config');
const logger = require('../config/logger');

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretKey,
  region: config.aws.region
});

const s3 = new AWS.S3();

const uploadImageToS3 = async (file) => {
    try {  
      const fileStream = new Readable();
      fileStream.push(file.buffer);
      fileStream.push(null);
      
      const params = {
        Bucket: config.aws.bucket,
        Key: file.originalname,
        Body: fileStream
      };
      const data = await s3.upload(params).promise();
  
      return data.Location;
    } catch (err) {
      logger.error('Error uploading image:', err);
     throw new Error(err.message)
    }  
};

module.exports = uploadImageToS3;
