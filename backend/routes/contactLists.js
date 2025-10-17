/**
 * Contact List Routes
 */

const express = require('express');
const router = express.Router();
const contactListController = require('../controllers/contactListController');

// Get all contact lists
router.get('/', contactListController.getAllContactLists);

// Get single contact list
router.get('/:id', contactListController.getContactListById);

// Create new contact list
router.post('/', contactListController.createContactList);

// Update contact list
router.put('/:id', contactListController.updateContactList);

// Delete contact list
router.delete('/:id', contactListController.deleteContactList);

// Get contacts in a list
router.get('/:id/contacts', contactListController.getListContacts);

// Add contacts to static list
router.post('/:id/contacts', contactListController.addContactsToList);

// Remove contacts from static list
router.delete('/:id/contacts', contactListController.removeContactsFromList);

// Refresh dynamic list count
router.post('/:id/refresh', contactListController.refreshListCount);

module.exports = router;
