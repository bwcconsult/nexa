const { Order } = require('../models');
const { createController } = require('./genericController');

const baseController = createController(Order, 'Order', ['order_number']);

module.exports = {
  getOrders: baseController.getAll,
  getOrder: baseController.getOne,
  createOrder: baseController.create,
  updateOrder: baseController.update,
  deleteOrder: baseController.delete,
};
