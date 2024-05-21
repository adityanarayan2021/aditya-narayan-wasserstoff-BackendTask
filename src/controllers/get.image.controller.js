const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const Image = require("../models/image-lable.model");
const logger = require("../config/logger");

const getAllImagesByStatus = catchAsync(async (req, res) => {
  try {
    const status = req.params.status;
    let query = {};

    if (status) {
      query = { status: status.toLowerCase() };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const count = await Image.countDocuments(query);
    const totalPages = Math.ceil(count / limit);
    const images = await Image.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(httpStatus.OK).json({ 
      msg: `Fetched all ${status} images`, 
      data: images, 
      pagination: {
        totalPages,
        currentPage: page,
        totalItems: count
      }
    });
  } catch (error) {
    logger.error('Error fetching images:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch images' });
  }
});


module.exports = {
    getAllImagesByStatus,
}