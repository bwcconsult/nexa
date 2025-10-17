/**
 * Import/Export Controller
 * 
 * Handle bulk data operations
 */

const { ImportJob, ExportJob, Lead, Contact, Account, Deal, Product, Task } = require('../models');
const csv = require('csv-parser');
const { createObjectCsvStringifier } = require('csv-writer');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// Model mapping
const ENTITY_MODELS = {
  leads: Lead,
  contacts: Contact,
  accounts: Account,
  deals: Deal,
  products: Product,
  tasks: Task
};

/**
 * Create import job
 * POST /api/v1/import
 */
exports.createImportJob = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { entity_type, field_mapping, import_options } = req.body;
    const file = req.file; // Assuming multer middleware
    
    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }
    
    const importJob = await ImportJob.create({
      entity_type,
      file_name: file.originalname,
      file_url: file.path,
      file_size: file.size,
      field_mapping: field_mapping || {},
      import_options: import_options || {},
      created_by: userId,
      status: 'pending'
    });
    
    // Start processing in background (async)
    processImportJob(importJob.id).catch(err => {
      console.error('Import processing error:', err);
    });
    
    res.status(201).json(importJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get import job status
 * GET /api/v1/import/:id
 */
exports.getImportJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const importJob = await ImportJob.findByPk(id);
    
    if (!importJob) {
      return res.status(404).json({ message: 'Import job not found' });
    }
    
    res.json(importJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all import jobs for user
 * GET /api/v1/import
 */
exports.getAllImportJobs = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { status, entity_type } = req.query;
    
    const where = { created_by: userId };
    if (status) where.status = status;
    if (entity_type) where.entity_type = entity_type;
    
    const jobs = await ImportJob.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: 50
    });
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create export job
 * POST /api/v1/export
 */
exports.createExportJob = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { entity_type, export_format = 'csv', filters = {}, selected_fields = [] } = req.body;
    
    const fileName = `${entity_type}_export_${Date.now()}.${export_format}`;
    
    const exportJob = await ExportJob.create({
      entity_type,
      export_format,
      file_name: fileName,
      filters,
      selected_fields,
      created_by: userId,
      status: 'pending',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    // Start processing in background
    processExportJob(exportJob.id).catch(err => {
      console.error('Export processing error:', err);
    });
    
    res.status(201).json(exportJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get export job status
 * GET /api/v1/export/:id
 */
exports.getExportJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const exportJob = await ExportJob.findByPk(id);
    
    if (!exportJob) {
      return res.status(404).json({ message: 'Export job not found' });
    }
    
    res.json(exportJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Download export file
 * GET /api/v1/export/:id/download
 */
exports.downloadExport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const exportJob = await ExportJob.findByPk(id);
    
    if (!exportJob) {
      return res.status(404).json({ message: 'Export job not found' });
    }
    
    if (exportJob.status !== 'completed') {
      return res.status(400).json({ message: 'Export is not ready yet' });
    }
    
    if (new Date() > exportJob.expires_at) {
      return res.status(410).json({ message: 'Export file has expired' });
    }
    
    // Send file
    res.download(exportJob.file_url, exportJob.file_name);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Background job processor for imports
 */
async function processImportJob(jobId) {
  const job = await ImportJob.findByPk(jobId);
  if (!job) return;
  
  try {
    await job.update({ status: 'processing', started_at: new Date() });
    
    const Model = ENTITY_MODELS[job.entity_type];
    if (!Model) {
      throw new Error('Invalid entity type');
    }
    
    const results = {
      successful: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
    
    const rows = [];
    
    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(job.file_url)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    
    await job.update({ total_rows: rows.length });
    
    // Process each row
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const mappedData = mapRowToFields(row, job.field_mapping);
        
        // Check for duplicates if option enabled
        if (job.import_options.skip_duplicates) {
          const existing = await Model.findOne({
            where: { email: mappedData.email }
          });
          if (existing) {
            results.skipped++;
            continue;
          }
        }
        
        // Create or update
        if (job.import_options.update_existing && mappedData.email) {
          await Model.upsert(mappedData);
        } else {
          await Model.create(mappedData);
        }
        
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: error.message
        });
      }
      
      // Update progress every 100 rows
      if (i % 100 === 0) {
        await job.update({ processed_rows: i + 1 });
      }
    }
    
    // Complete job
    await job.update({
      status: 'completed',
      processed_rows: rows.length,
      successful_rows: results.successful,
      failed_rows: results.failed,
      skipped_rows: results.skipped,
      errors: results.errors,
      completed_at: new Date()
    });
    
  } catch (error) {
    await job.update({
      status: 'failed',
      errors: [{ error: error.message }],
      completed_at: new Date()
    });
  }
}

/**
 * Background job processor for exports
 */
async function processExportJob(jobId) {
  const job = await ExportJob.findByPk(jobId);
  if (!job) return;
  
  try {
    await job.update({ status: 'processing', started_at: new Date() });
    
    const Model = ENTITY_MODELS[job.entity_type];
    if (!Model) {
      throw new Error('Invalid entity type');
    }
    
    // Build query with filters
    const where = buildFiltersWhere(job.filters);
    
    // Fetch data
    const records = await Model.findAll({ where });
    
    await job.update({ total_records: records.length });
    
    // Generate CSV
    const filePath = path.join(__dirname, '../exports', job.file_name);
    
    // Ensure exports directory exists
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    const fields = job.selected_fields.length > 0 
      ? job.selected_fields 
      : Object.keys(records[0]?.dataValues || {});
    
    const csvStringifier = createObjectCsvStringifier({
      header: fields.map(f => ({ id: f, title: f }))
    });
    
    const csvData = csvStringifier.getHeaderString() + 
      csvStringifier.stringifyRecords(records.map(r => r.dataValues));
    
    fs.writeFileSync(filePath, csvData);
    
    const fileSize = fs.statSync(filePath).size;
    
    // Complete job
    await job.update({
      status: 'completed',
      file_url: filePath,
      file_size: fileSize,
      completed_at: new Date()
    });
    
  } catch (error) {
    await job.update({
      status: 'failed',
      completed_at: new Date()
    });
  }
}

/**
 * Helper: Map CSV row to model fields
 */
function mapRowToFields(row, fieldMapping) {
  const mapped = {};
  
  Object.entries(fieldMapping).forEach(([csvColumn, crmField]) => {
    if (row[csvColumn] !== undefined) {
      mapped[crmField] = row[csvColumn];
    }
  });
  
  return mapped;
}

/**
 * Helper: Build WHERE clause from filters
 */
function buildFiltersWhere(filters) {
  const where = {};
  
  Object.entries(filters).forEach(([field, value]) => {
    if (Array.isArray(value)) {
      where[field] = { [Op.in]: value };
    } else if (typeof value === 'object' && value.operator) {
      // Handle complex filters
      switch (value.operator) {
        case 'equals':
          where[field] = value.value;
          break;
        case 'contains':
          where[field] = { [Op.iLike]: `%${value.value}%` };
          break;
        case 'greater_than':
          where[field] = { [Op.gt]: value.value };
          break;
        case 'less_than':
          where[field] = { [Op.lt]: value.value };
          break;
      }
    } else {
      where[field] = value;
    }
  });
  
  return where;
}
