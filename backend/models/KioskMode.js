const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KioskMode = sequelize.define('KioskMode', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  kiosk_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  target_module: {
    type: DataTypes.ENUM('leads', 'contacts', 'visitors', 'registrations', 'custom'),
    defaultValue: 'leads',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  access_code: {
    type: DataTypes.STRING,
    comment: 'PIN or code to access kiosk',
  },
  qr_code_url: {
    type: DataTypes.STRING,
    comment: 'QR code for quick access',
  },
  form_fields: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of fields to show in kiosk form',
  },
  required_fields: {
    type: DataTypes.JSONB,
    defaultValue: ['name', 'email'],
  },
  enable_photo_capture: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  enable_signature: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  enable_qr_scan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  enable_barcode_scan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  offline_mode: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Allow data capture when offline',
  },
  auto_assign_to: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'Auto-assign captured leads to this user',
  },
  welcome_screen_config: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Logo, message, colors',
  },
  thank_you_screen_config: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Thank you message and next steps',
  },
  data_sync_frequency_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  session_timeout_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
  },
  location_tracking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  event_name: {
    type: DataTypes.STRING,
    comment: 'Name of event/trade show',
  },
  event_date: {
    type: DataTypes.DATE,
  },
  booth_number: {
    type: DataTypes.STRING,
  },
  capture_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_capture_at: {
    type: DataTypes.DATE,
  },
  created_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'kiosk_modes',
  indexes: [
    { fields: ['access_code'] },
    { fields: ['is_active'] },
    { fields: ['target_module'] },
  ],
});

module.exports = KioskMode;
