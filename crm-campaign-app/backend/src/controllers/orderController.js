const Order = require('../models/Order');
const Customer = require('../models/Customer');

const orderController = {
  // Create new order
  async create(req, res) {
    try {
      const order = new Order(req.body);
      await order.save();

      // Update customer's totalSpending and lastVisit
      await Customer.findByIdAndUpdate(
        order.customerId,
        {
          $inc: { 
            totalSpending: order.amount,
            visitCount: 1
          },
          lastVisit: order.orderDate
        }
      );

      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all orders
  async getAll(req, res) {
    try {
      const orders = await Order.find().populate('customerId');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get order by ID
  async getById(req, res) {
    try {
      const order = await Order.findById(req.params.id).populate('customerId');
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = orderController;