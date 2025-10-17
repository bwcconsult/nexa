const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { sesClient, SES_FROM_EMAIL, SES_FROM_NAME } = require('../config/aws');
const logger = require('../config/logger');

/**
 * Send email using AWS SES
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body
 * @param {string} options.from - Sender email (optional)
 */
exports.sendEmail = async (options) => {
  try {
    const params = {
      Source: options.from || `${SES_FROM_NAME} <${SES_FROM_EMAIL}>`,
      Destination: {
        ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
        ...(options.cc && { CcAddresses: Array.isArray(options.cc) ? options.cc : [options.cc] }),
        ...(options.bcc && { BccAddresses: Array.isArray(options.bcc) ? options.bcc : [options.bcc] }),
      },
      Message: {
        Subject: {
          Data: options.subject,
          Charset: 'UTF-8',
        },
        Body: {
          ...(options.text && {
            Text: {
              Data: options.text,
              Charset: 'UTF-8',
            },
          }),
          ...(options.html && {
            Html: {
              Data: options.html,
              Charset: 'UTF-8',
            },
          }),
        },
      },
    };

    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);

    logger.info(`Email sent successfully to ${options.to}`, { messageId: result.MessageId });

    return {
      success: true,
      messageId: result.MessageId,
    };
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send templated email
 */
exports.sendTemplateEmail = async (options) => {
  const templates = {
    welcome: (data) => ({
      subject: 'Welcome to Nexa CRM',
      html: `
        <h1>Welcome ${data.name}!</h1>
        <p>Thank you for joining Nexa CRM.</p>
        <p>Your account has been successfully created.</p>
      `,
    }),
    passwordReset: (data) => ({
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${data.resetUrl}">${data.resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    }),
    invoice: (data) => ({
      subject: `Invoice ${data.invoiceNumber} from Nexa CRM`,
      html: `
        <h1>Invoice ${data.invoiceNumber}</h1>
        <p>Amount: $${data.amount}</p>
        <p>Due Date: ${data.dueDate}</p>
      `,
    }),
  };

  const template = templates[options.template];
  if (!template) {
    throw new Error(`Template '${options.template}' not found`);
  }

  const emailContent = template(options.data);

  return this.sendEmail({
    to: options.to,
    subject: emailContent.subject,
    html: emailContent.html,
  });
};

module.exports = exports;
