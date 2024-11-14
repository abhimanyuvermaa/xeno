const Segment = require('../models/Segment');
const Customer = require('../models/Customer');

const segmentController = {
  // Create new segment
  async create(req, res) {
    try {
      const segment = new Segment(req.body);
      await segment.save();
      res.status(201).json(segment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all segments
  async getAll(req, res) {
    try {
      const segments = await Segment.find();
      res.json(segments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get segment by ID
  async getById(req, res) {
    try {
      const segment = await Segment.findById(req.params.id);
      if (!segment) return res.status(404).json({ message: 'Segment not found' });
      res.json(segment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get customers in segment
  async getCustomersInSegment(req, res) {
    try {
      const segment = await Segment.findById(req.params.id);
      if (!segment) return res.status(404).json({ message: 'Segment not found' });

      const criteria = segment.criteria;
      const query = {};

      if (criteria.spendingThreshold) {
        query.totalSpending = { $gte: criteria.spendingThreshold };
      }
      if (criteria.visitCount) {
        query.visitCount = { $gte: criteria.visitCount };
      }
      if (criteria.lastVisitDays) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - criteria.lastVisitDays);
        query.lastVisit = { $gte: daysAgo };
      }

      const customers = await Customer.find(query);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = segmentController;