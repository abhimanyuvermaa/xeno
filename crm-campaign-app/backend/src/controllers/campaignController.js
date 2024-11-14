const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');
const segmentController = require('./segmentController');

const campaignController = {
  // Create new campaign
  async create(req, res) {
    try {
      const campaign = new Campaign(req.body);
      await campaign.save();
      res.status(201).json(campaign);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all campaigns
  async getAll(req, res) {
    try {
      const campaigns = await Campaign.find().populate('segmentId');
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get campaign by ID
  async getById(req, res) {
    try {
      const campaign = await Campaign.findById(req.params.id).populate('segmentId');
      if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Execute campaign
  async execute(req, res) {
    try {
      const campaign = await Campaign.findById(req.params.id);
      if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

      // Get customers in segment
      const customers = await Customer.find({ segmentId: campaign.segmentId });

      // Create communication logs for each customer
      const logs = customers.map(customer => ({
        campaignId: campaign._id,
        customerId: customer._id,
        type: campaign.type,
        status: 'sent'
      }));

      await CommunicationLog.insertMany(logs);

      // Update campaign status
      campaign.status = 'completed';
      await campaign.save();

      res.json({ message: 'Campaign executed successfully', logsCreated: logs.length });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = campaignController;