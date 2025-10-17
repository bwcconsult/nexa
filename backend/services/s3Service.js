const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3Client, S3_BUCKET } = require('../config/aws');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} folder - S3 folder (e.g., 'documents', 'avatars')
 * @param {string} mimeType - File MIME type
 */
exports.uploadFile = async (fileBuffer, fileName, folder = 'documents', mimeType) => {
  try {
    const fileExtension = path.extname(fileName);
    const fileKey = `${folder}/${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: S3_BUCKET,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: mimeType,
      ServerSideEncryption: 'AES256',
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const fileUrl = `https://${S3_BUCKET}.s3.amazonaws.com/${fileKey}`;

    logger.info(`File uploaded to S3: ${fileKey}`);

    return {
      key: fileKey,
      url: fileUrl,
      bucket: S3_BUCKET,
    };
  } catch (error) {
    logger.error('S3 upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Get signed URL for private file access
 * @param {string} fileKey - S3 file key
 * @param {number} expiresIn - URL expiration in seconds (default: 3600 = 1 hour)
 */
exports.getSignedUrl = async (fileKey, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return signedUrl;
  } catch (error) {
    logger.error('S3 signed URL error:', error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};

/**
 * Delete file from S3
 * @param {string} fileKey - S3 file key
 */
exports.deleteFile = async (fileKey) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileKey,
    });

    await s3Client.send(command);

    logger.info(`File deleted from S3: ${fileKey}`);

    return { success: true };
  } catch (error) {
    logger.error('S3 delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

module.exports = exports;
