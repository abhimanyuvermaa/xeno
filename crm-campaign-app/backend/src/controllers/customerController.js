const Customer = require('../models/Customer');

const customerController = {
  // Create new customer
  async create(req, res) {
    try {
      const customer = new Customer(req.body);
      await customer.save();
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all customers
  async getAll(req, res) {
    try {
      const customers = await Customer.find();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get customer by ID
  async getById(req, res) {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update customer
  async update(req, res) {
    try {
      const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = customerController;