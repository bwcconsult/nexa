const AWS = require('aws-sdk');
const { S3Client } = require('@aws-sdk/client-s3');
const { SESClient } = require('@aws-sdk/client-ses');
const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// S3 Client (for file uploads)
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// SES Client (for emails)
const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Cognito Client (for authentication)
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_COGNITO_REGION || process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = {
  AWS,
  s3Client,
  sesClient,
  cognitoClient,
  S3_BUCKET: process.env.AWS_S3_BUCKET,
  SES_FROM_EMAIL: process.env.AWS_SES_FROM_EMAIL,
  SES_FROM_NAME: process.env.AWS_SES_FROM_NAME,
};
