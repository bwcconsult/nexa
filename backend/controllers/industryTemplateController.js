const { IndustryTemplate } = require('../models');

// Get all industry templates
exports.getAllIndustryTemplates = async (req, res) => {
  try {
    const { category, is_active } = req.query;
    
    const where = {};
    if (category) where.category = category;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const templates = await IndustryTemplate.findAll({
      where,
      order: [['popularity_rank', 'ASC'], ['industry_name', 'ASC']],
    });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single industry template
exports.getIndustryTemplateById = async (req, res) => {
  try {
    const template = await IndustryTemplate.findByPk(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Industry template not found' });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create industry template
exports.createIndustryTemplate = async (req, res) => {
  try {
    const template = await IndustryTemplate.create(req.body);
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update industry template
exports.updateIndustryTemplate = async (req, res) => {
  try {
    const template = await IndustryTemplate.findByPk(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Industry template not found' });
    }

    await template.update(req.body);
    res.json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete industry template
exports.deleteIndustryTemplate = async (req, res) => {
  try {
    const template = await IndustryTemplate.findByPk(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Industry template not found' });
    }

    await template.destroy();
    res.json({ message: 'Industry template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get industry template by name
exports.getIndustryTemplateByName = async (req, res) => {
  try {
    const template = await IndustryTemplate.findOne({
      where: { industry_name: req.params.name }
    });
    
    if (!template) {
      return res.status(404).json({ message: 'Industry template not found' });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply industry template to user/organization
exports.applyIndustryTemplate = async (req, res) => {
  try {
    const template = await IndustryTemplate.findByPk(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Industry template not found' });
    }

    // Return the configuration that should be applied
    res.json({
      message: 'Industry template retrieved successfully',
      configuration: {
        terminology: template.terminology,
        custom_fields: template.custom_fields,
        workflow_templates: template.workflow_templates,
        dashboard_config: template.dashboard_config,
        pipeline_stages: template.pipeline_stages,
        email_templates: template.email_templates,
        recommended_integrations: template.recommended_integrations,
        compliance_features: template.compliance_features,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
