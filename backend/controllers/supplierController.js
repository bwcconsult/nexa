const { Supplier } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Supplier, 'Supplier', ['name', 'contact_person', 'email']);

module.exports = {
  getSuppliers: baseController.getAll,
  getSupplier: baseController.getOne,
  createSupplier: baseController.create,
  updateSupplier: baseController.update,
  deleteSupplier: baseController.delete,
};
