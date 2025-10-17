const { Product } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Product, 'Product', ['name', 'sku', 'description']);

module.exports = {
  getProducts: baseController.getAll,
  getProduct: baseController.getOne,
  createProduct: baseController.create,
  updateProduct: baseController.update,
  deleteProduct: baseController.delete,
};
