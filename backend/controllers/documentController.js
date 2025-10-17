const { Document } = require('../models');
const { createController } = require('./genericController');
const { uploadToS3, deleteFromS3 } = require('../services/s3Service');
const logger = require('../config/logger');

const baseController = createController(Document, 'Document', ['title', 'file_name']);

module.exports = {
  getDocuments: baseController.getAll,
  getDocument: baseController.getOne,
  createDocument: baseController.create,
  updateDocument: baseController.update,
  deleteDocument: async (req, res) => {
    try {
      const document = await Document.findByPk(req.params.id);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found',
        });
      }

      // Delete from S3 if exists
      if (document.s3_key) {
        await deleteFromS3(document.s3_key);
      }

      await document.destroy();

      res.json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      logger.error('Delete document error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting document',
        error: error.message,
      });
    }
  },

  // Upload document
  uploadDocument: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided',
        });
      }

      const { folder = 'documents', title, related_to_type, related_to_id } = req.body;

      // Upload to S3
      const uploadResult = await uploadToS3(req.file, folder);

      // Create document record
      const document = await Document.create({
        title: title || req.file.originalname,
        file_name: req.file.originalname,
        file_type: req.file.mimetype,
        file_size: req.file.size,
        file_url: uploadResult.url,
        s3_key: uploadResult.key,
        folder,
        uploaded_by: req.user.id,
        related_to_type,
        related_to_id,
      });

      res.status(201).json({
        success: true,
        data: document,
      });
    } catch (error) {
      logger.error('Upload document error:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading document',
        error: error.message,
      });
    }
  },
};
