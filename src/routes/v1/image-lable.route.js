const express = require('express');
const auth = require('../../middlewares/auth');
const imageController = require('../../controllers/image-lable.controller');
const multer = require('multer');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const getImageController = require('../../controllers/get.image.controller');


router
  .route('/')
  .post(auth('user'), upload.single('image'), imageController.imageLabeling)

  router
  .route('/:status')
  .get(auth('getUsers'),getImageController.getAllImagesByStatus)

  router
  .route('/:imageId')
  .put(auth('getUsers'), imageController.updateImageStatus)

  router
  .route('/export/csv')
  .get(auth('getUsers'), imageController.exportDataInCsv)



module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Image
 *   description: Image-related operations
 */

/**
 * @swagger
 * /images:
 *   post:
 *     summary: Upload an image and label it
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: Image uploaded and labeled successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'

 * /images/{status}:
 *   get:
 *     summary: Get all images by status
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Status of the images to retrieve
 *     responses:
 *       "200":
 *         description: Successfully retrieved images by status
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'

 * /images/{imageId}:
 *   put:
 *     summary: Update the status of an image
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the image to update
 *     responses:
 *       "200":
 *         description: Image status updated successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'

 * /images/export/csv:
 *   get:
 *     summary: Export image data in CSV format
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Image data exported successfully in CSV format
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

