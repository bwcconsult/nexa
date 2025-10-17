const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(accountController.getAccounts)
  .post(accountController.createAccount);

router
  .route('/:id')
  .get(accountController.getAccount)
  .put(accountController.updateAccount)
  .delete(accountController.deleteAccount);

module.exports = router;
