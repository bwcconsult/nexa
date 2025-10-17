/**
 * Conversation Controller
 * 
 * Shared inbox conversations management
 */

const { Conversation, Message, Contact, Lead, Account, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all conversations
 * GET /api/v1/conversations
 */
exports.getAllConversations = async (req, res) => {
  try {
    const { 
      status, 
      channel, 
      assigned_to, 
      is_read, 
      search,
      page = 1,
      limit = 50
    } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (channel) where.channel = channel;
    if (assigned_to) where.assigned_to = assigned_to;
    if (is_read !== undefined) where.is_read = is_read === 'true';
    if (search) {
      where.subject = { [Op.iLike]: `%${search}%` };
    }
    
    const { rows: conversations, count } = await Conversation.findAndCountAll({
      where,
      include: [
        { model: Contact, as: 'contact', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'assignedUser', attributes: ['id', 'first_name', 'last_name', 'email'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['last_message_at', 'DESC']]
    });
    
    res.json({
      conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single conversation with messages
 * GET /api/v1/conversations/:id
 */
exports.getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findByPk(id, {
      include: [
        { model: Contact, as: 'contact' },
        { model: Lead, as: 'lead' },
        { model: Account, as: 'account' },
        { model: User, as: 'assignedUser', attributes: ['id', 'first_name', 'last_name', 'email'] }
      ]
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Get messages
    const messages = await Message.findAll({
      where: { conversation_id: id },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name', 'email'] }
      ],
      order: [['created_at', 'ASC']]
    });
    
    res.json({
      ...conversation.toJSON(),
      messages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create new conversation
 * POST /api/v1/conversations
 */
exports.createConversation = async (req, res) => {
  try {
    const conversation = await Conversation.create(req.body);
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update conversation
 * PUT /api/v1/conversations/:id
 */
exports.updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findByPk(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // If closing conversation
    if (req.body.status === 'closed' && conversation.status !== 'closed') {
      req.body.closed_at = new Date();
      req.body.closed_by = req.user?.id;
    }
    
    await conversation.update(req.body);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Assign conversation to user
 * POST /api/v1/conversations/:id/assign
 */
exports.assignConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body;
    
    const conversation = await Conversation.findByPk(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    await conversation.update({ assigned_to });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mark conversation as read/unread
 * POST /api/v1/conversations/:id/mark-read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read = true } = req.body;
    
    const conversation = await Conversation.findByPk(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    await conversation.update({ is_read });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add message to conversation
 * POST /api/v1/conversations/:id/messages
 */
exports.addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const conversation = await Conversation.findByPk(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const message = await Message.create({
      ...req.body,
      conversation_id: id,
      sent_by: userId,
      sent_at: new Date()
    });
    
    // Update conversation
    await conversation.update({
      last_message_at: new Date(),
      last_message_from: req.body.from_name || 'Team',
      message_count: conversation.message_count + 1,
      is_read: false
    });
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get conversation statistics
 * GET /api/v1/conversations/stats
 */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const stats = {
      total: await Conversation.count(),
      open: await Conversation.count({ where: { status: 'open' } }),
      pending: await Conversation.count({ where: { status: 'pending' } }),
      closed: await Conversation.count({ where: { status: 'closed' } }),
      unread: await Conversation.count({ where: { is_read: false } }),
      assignedToMe: await Conversation.count({ where: { assigned_to: userId } }),
      unassigned: await Conversation.count({ where: { assigned_to: null } }),
      byChannel: {
        email: await Conversation.count({ where: { channel: 'email' } }),
        chat: await Conversation.count({ where: { channel: 'chat' } }),
        sms: await Conversation.count({ where: { channel: 'sms' } }),
        social: await Conversation.count({ where: { channel: 'social' } }),
        phone: await Conversation.count({ where: { channel: 'phone' } }),
        form: await Conversation.count({ where: { channel: 'form' } })
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete conversation
 * DELETE /api/v1/conversations/:id
 */
exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findByPk(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Delete all messages first
    await Message.destroy({ where: { conversation_id: id } });
    
    // Delete conversation
    await conversation.destroy();
    
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
