import prisma from '@/lib/prisma';
import { Campaign, Segment } from '@prisma/client';

interface MessageDeliveryResult {
  success: boolean;
  error?: string;
}

export class CampaignProcessor {
  static async executeCampaign(campaignId: string): Promise<void> {
    try {
      // Get campaign with segment
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          segment: true,
        },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Update campaign status to IN_PROGRESS
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'IN_PROGRESS' },
      });

      // Get customers in segment based on rules
      const customers = await this.getCustomersInSegment(campaign.segment);

      // Process messages in batches
      const batchSize = 100;
      for (let i = 0; i < customers.length; i += batchSize) {
        const batch = customers.slice(i, i + batchSize);
        await this.processBatch(campaign, batch);
      }

      // Update campaign status to COMPLETED
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'COMPLETED' },
      });
    } catch (error) {
      console.error('Campaign execution error:', error);
      
      // Update campaign status to FAILED
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'FAILED' },
      });
      
      throw error;
    }
  }

  private static async getCustomersInSegment(segment: Segment): Promise<any[]> {
    const { rules } = segment;
    const query: any = {};

    if (rules.minPurchaseAmount) {
      query.totalSpending = { gte: rules.minPurchaseAmount };
    }

    if (rules.minVisitCount) {
      query.visitCount = { gte: rules.minVisitCount };
    }

    if (rules.lastVisitDays) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - rules.lastVisitDays);
      query.lastVisit = { gte: daysAgo };
    }

    return await prisma.customer.findMany({ where: query });
  }

  private static async processBatch(campaign: Campaign, customers: any[]): Promise<void> {
    const logs = customers.map(customer => ({
      campaignId: campaign.id,
      customerId: customer.id,
      type: campaign.type,
      message: this.personalizeMessage(campaign.message, customer),
      status: 'PENDING',
    }));

    // Create communication logs
    await prisma.communicationLog.createMany({
      data: logs,
    });

    // Process each message
    for (const log of logs) {
      const result = await this.sendMessage(log);
      
      // Update communication log status
      await prisma.communicationLog.update({
        where: { id: log.id },
        data: { 
          status: result.success ? 'SENT' : 'FAILED',
          error: result.error
        },
      });
    }
  }

  private static personalizeMessage(message: any, customer: any): string {
    let personalizedMessage = message.body;
    // Replace placeholders with customer data
    personalizedMessage = personalizedMessage.replace('[Name]', customer.name);
    return personalizedMessage;
  }

  private static async sendMessage(log: any): Promise<MessageDeliveryResult> {
    // Simulate message sending with 90% success rate
    const success = Math.random() < 0.9;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success,
      error: success ? undefined : 'Failed to deliver message'
    };
  }
}