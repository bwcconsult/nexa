const express = require('express');
const router = express.Router();
const multer = require('multer');
const documentController = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.use(protect);

router.post('/upload', upload.single('file'), documentController.uploadDocument);

router
  .route('/')
  .get(documentController.getDocuments)
  .post(documentController.createDocument);

router
  .route('/:id')
  .get(documentController.getDocument)
  .put(documentController.updateDocument)
  .delete(documentController.deleteDocument);

module.exports = router;
