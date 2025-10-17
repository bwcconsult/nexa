/**
 * Contact List Controller
 * 
 * Manage saved contact segments and lists
 */

const { ContactList, Contact } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all contact lists for current user
 * GET /api/v1/contact-lists
 */
exports.getAllContactLists = async (req, res) => {
  try {
    const { type, is_favorite, search } = req.query;
    const userId = req.user?.id;
    
    const where = {
      [Op.or]: [
        { created_by: userId },
        { is_shared: true }
      ]
    };
    
    if (type) where.list_type = type;
    if (is_favorite !== undefined) where.is_favorite = is_favorite === 'true';
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }
    
    const lists = await ContactList.findAll({
      where,
      order: [
        ['is_favorite', 'DESC'],
        ['updated_at', 'DESC']
      ]
    });
    
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single contact list
 * GET /api/v1/contact-lists/:id
 */
exports.getContactListById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const list = await ContactList.findByPk(id);
    
    if (!list) {
      return res.status(404).json({ message: 'Contact list not found' });
    }
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create new contact list
 * POST /api/v1/contact-lists
 */
exports.createContactList = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const listData = {
      ...req.body,
      created_by: userId,
      contact_count: req.body.contact_ids?.length || 0,
      last_updated_count: new Date()
    };
    
    const list = await ContactList.create(listData);
    
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update contact list
 * PUT /api/v1/contact-lists/:id
 */
exports.updateContactList = async (req, res) => {
  try {
    const { id } = req.params;
    
    const list = await ContactList.findByPk(id);
    
    if (!list) {
      return res.status(404).json({ message: 'Contact list not found' });
    }
    
    // Update contact count if contact_ids changed
    if (req.body.contact_ids) {
      req.body.contact_count = req.body.contact_ids.length;
      req.body.last_updated_count = new Date();
    }
    
    await list.update(req.body);
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete contact list
 * DELETE /api/v1/contact-lists/:id
 */
exports.deleteContactList = async (req, res) => {
  try {
    const { id } = req.params;
    
    const list = await ContactList.findByPk(id);
    
    if (!list) {
      return res.status(404).json({ message: 'Contact list not found' });
    }
    
    await list.destroy();
    
    res.json({ message: 'Contact list deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get contacts in a list (with pagination)
 * GET /api/v1/contact-lists/:id/contacts
 */
exports.getListContacts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const list = await ContactList.findByPk(id);
    
    if (!list) {
      return res.status(404).json({ message: 'Contact list not found' });
    }
    
    let contacts;
    let total;
    
    if (list.list_type === 'static') {
      // Static list - get by IDs
      contacts = await Contact.findAll({
        where: {
          id: { [Op.in]: list.contact_ids }
        },
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']]
      });
      total = list.contact_ids.length;
    } else {
      // Dynamic list - apply criteria
      const where = buildCriteriaWhere(list.criteria);
      
      const result = await Contact.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']]
      });
      
      contacts = result.rows;
      total = result.count;
      
      // Update cached count if different
      if (total !== list.contact_count) {
        await list.update({
          contact_count: total,
          last_updated_count: new Date()
        });
      }
    }
    
    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add contacts to static list
 * POST /api/v1/contact-lists/:id/contacts
 */
exports.addContactsToList = async (req, res) => {
  try {
    const { id } = req.params;
    const { contact_ids } = req.body;
    
    if (!contact_ids || !Array.isArray(contact_ids)) {
      return res.status(400).json({ message: 'contact_ids array is required' });
    }
    
    const list = await ContactList.findByPk(id);
    
    if (!list) {
      return res.status(404).json({ message: 'Contact list not found' });
    }
    
    if (list.list_type !== 'static') {
      return res.status(400).json({ message: 'Can only add contacts to static lists' });
    }
    
    // Merge new contacts with existing (deduplicate)
    const updatedContactIds = [...new Set([...list.contact_ids, ...contact_ids])];
    
    await list.update({
      contact_ids: updatedContactIds,
      contact_count: updatedContactIds.length,
      last_updated_count: new Date()
    });
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove contacts from static list
 * DELETE /api/v1/contact-lists/:id/contacts
 */
exports.removeContactsFromList = async (req, res) => {
  try {
    const { id } = req.params;
    const { contact_ids } = req.body;
    
    if (!contact_ids || !Array.isArray(contact_ids)) {
      return res.status(400).json({ message: 'contact_ids array is required' });
    }
    
    const list = await ContactList.findByPk(id);
    
    if (!list) {
      return res.status(404).json({ message: 'Contact list not found' });
    }
    
    if (list.list_type !== 'static') {
      return res.status(400).json({ message: 'Can only remove contacts from static lists' });
    }
    
    // Remove specified contacts
    const updatedContactIds = list.contact_ids.filter(
      cid => !contact_ids.includes(cid)
    );
    
    await list.update({
      contact_ids: updatedContactIds,
      contact_count: updatedContactIds.length,
      last_updated_count: new Date()
    });
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Refresh contact count for dynamic list
 * POST /api/v1/contact-lists/:id/refresh
 */
exports.refreshListCount = async (req, res) => {
  try {
    const { id } = req.params;
    
    const list = await ContactList.findByPk(id);
    
    if (!list) {
      return res.status(404).json({ message: 'Contact list not found' });
    }
    
    if (list.list_type === 'static') {
      return res.status(400).json({ message: 'Static lists do not need refresh' });
    }
    
    // Count contacts matching criteria
    const where = buildCriteriaWhere(list.criteria);
    const count = await Contact.count({ where });
    
    await list.update({
      contact_count: count,
      last_updated_count: new Date()
    });
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Helper function to build WHERE clause from criteria
 */
function buildCriteriaWhere(criteria) {
  const where = {};
  
  if (!criteria || Object.keys(criteria).length === 0) {
    return where;
  }
  
  // Example criteria structure:
  // {
  //   email: { operator: 'contains', value: '@gmail.com' },
  //   status: { operator: 'equals', value: 'active' },
  //   created_at: { operator: 'after', value: '2024-01-01' }
  // }
  
  Object.entries(criteria).forEach(([field, condition]) => {
    if (!condition || !condition.operator) return;
    
    switch (condition.operator) {
      case 'equals':
        where[field] = condition.value;
        break;
      case 'not_equals':
        where[field] = { [Op.ne]: condition.value };
        break;
      case 'contains':
        where[field] = { [Op.iLike]: `%${condition.value}%` };
        break;
      case 'not_contains':
        where[field] = { [Op.notILike]: `%${condition.value}%` };
        break;
      case 'starts_with':
        where[field] = { [Op.iLike]: `${condition.value}%` };
        break;
      case 'ends_with':
        where[field] = { [Op.iLike]: `%${condition.value}` };
        break;
      case 'is_empty':
        where[field] = { [Op.or]: [null, ''] };
        break;
      case 'is_not_empty':
        where[field] = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] };
        break;
      case 'greater_than':
        where[field] = { [Op.gt]: condition.value };
        break;
      case 'less_than':
        where[field] = { [Op.lt]: condition.value };
        break;
      case 'after':
        where[field] = { [Op.gt]: new Date(condition.value) };
        break;
      case 'before':
        where[field] = { [Op.lt]: new Date(condition.value) };
        break;
      case 'in':
        where[field] = { [Op.in]: condition.value };
        break;
      case 'not_in':
        where[field] = { [Op.notIn]: condition.value };
        break;
    }
  });
  
  return where;
}
