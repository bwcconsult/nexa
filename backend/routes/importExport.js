/**
 * Import/Export Routes
 */

const express = require('express');
const router = express.Router();
const importExportController = require('../controllers/importExportController');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Import routes
router.post('/import', upload.single('file'), importExportController.createImportJob);
router.get('/import', importExportController.getAllImportJobs);
router.get('/import/:id', importExportController.getImportJob);

// Export routes
router.post('/export', importExportController.createExportJob);
router.get('/export/:id', importExportController.getExportJob);
router.get('/export/:id/download', importExportController.downloadExport);

module.exports = router;
