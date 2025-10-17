/**
 * Conversation Routes (Shared Inbox)
 */

const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Get all conversations
router.get('/', conversationController.getAllConversations);

// Get conversation statistics
router.get('/stats', conversationController.getStats);

// Get single conversation with messages
router.get('/:id', conversationController.getConversation);

// Create new conversation
router.post('/', conversationController.createConversation);

// Update conversation
router.put('/:id', conversationController.updateConversation);

// Assign conversation to user
router.post('/:id/assign', conversationController.assignConversation);

// Mark as read/unread
router.post('/:id/mark-read', conversationController.markAsRead);

// Add message to conversation
router.post('/:id/messages', conversationController.addMessage);

// Delete conversation
router.delete('/:id', conversationController.deleteConversation);

module.exports = router;
