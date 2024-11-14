import prisma from '@/lib/prisma';
import { Campaign, Segment, CommunicationLog } from '@prisma/client';

interface MessageDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface BatchProcessingResult {
  total: number;
  successful: number;
  failed: number;
}

export class CampaignProcessor {
  static async executeCampaign(campaignId: string): Promise<void> {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          segment: true,
        },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Validate campaign status
      if (['COMPLETED', 'FAILED'].includes(campaign.status)) {
        throw new Error(`Campaign is already ${campaign.status.toLowerCase()}`);
      }

      // Update campaign status and start time
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { 
          status: 'IN_PROGRESS',
          startedAt: new Date()
        },
      });

      // Get eligible customers
      const customers = await this.getCustomersInSegment(campaign.segment);
      
      if (customers.length === 0) {
        throw new Error('No eligible customers found for this segment');
      }

      // Process in batches
      const batchResults: BatchProcessingResult[] = [];
      const batchSize = 100;
      
      for (let i = 0; i < customers.length; i += batchSize) {
        const batch = customers.slice(i, i + batchSize);
        const batchResult = await this.processBatch(campaign, batch);
        batchResults.push(batchResult);
      }

      // Calculate final statistics
      const finalStats = batchResults.reduce((acc, curr) => ({
        total: acc.total + curr.total,
        successful: acc.successful + curr.successful,
        failed: acc.failed + curr.failed
      }), { total: 0, successful: 0, failed: 0 });

      // Update campaign completion status and metrics
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { 
          status: 'COMPLETED',
          completedAt: new Date(),
          metrics: {
            totalMessages: finalStats.total,
            successfulDeliveries: finalStats.successful,
            failedDeliveries: finalStats.failed,
            deliveryRate: (finalStats.successful / finalStats.total) * 100
          }
        },
      });

    } catch (error) {
      console.error('Campaign execution error:', error);
      
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { 
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          completedAt: new Date()
        },
      });
      
      throw error;
    }
  }

  private static async getCustomersInSegment(segment: Segment): Promise<any[]> {
    const { rules } = segment;
    const query: any = {};

    // Build dynamic query based on segment rules
    Object.entries(rules).forEach(([key, value]) => {
      switch (key) {
        case 'minPurchaseAmount':
          query.totalSpending = { gte: value };
          break;
        case 'minVisitCount':
          query.visitCount = { gte: value };
          break;
        case 'lastVisitDays':
          const daysAgo = new Date();
          daysAgo.setDate(daysAgo.getDate() - Number(value));
          query.lastVisit = { gte: daysAgo };
          break;
        // Add more rule types as needed
      }
    });

    return await prisma.customer.findMany({ 
      where: query,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });
  }

  private static async processBatch(
    campaign: Campaign, 
    customers: any[]
  ): Promise<BatchProcessingResult> {
    const batchResult = {
      total: customers.length,
      successful: 0,
      failed: 0
    };

    // Create communication logs
    const logs = await prisma.communicationLog.createMany({
      data: customers.map(customer => ({
        campaignId: campaign.id,
        customerId: customer.id,
        type: campaign.type,
        message: this.personalizeMessage(campaign.message, customer),
        status: 'PENDING',
        createdAt: new Date()
      })),
    });

    // Process each message
    const createdLogs = await prisma.communicationLog.findMany({
      where: {
        campaignId: campaign.id,
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    for (const log of createdLogs) {
      const result = await this.sendMessage(log);
      
      await prisma.communicationLog.update({
        where: { id: log.id },
        data: { 
          status: result.success ? 'SENT' : 'FAILED',
          messageId: result.messageId,
          error: result.error,
          sentAt: new Date()
        },
      });

      if (result.success) {
        batchResult.successful++;
      } else {
        batchResult.failed++;
      }
    }

    return batchResult;
  }

  private static personalizeMessage(message: any, customer: any): string {
    const placeholders = {
      '[Name]': customer.name,
      '[Email]': customer.email,
      '[Phone]': customer.phone || 'N/A'
    };

    let personalizedMessage = message.body;
    Object.entries(placeholders).forEach(([placeholder, value]) => {
      personalizedMessage = personalizedMessage.replace(
        new RegExp(placeholder, 'g'), 
        value
      );
    });

    return personalizedMessage;
  }

  private static async sendMessage(log: CommunicationLog): Promise<MessageDeliveryResult> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));
      
      // Simulate 90% success rate
      const success = Math.random() < 0.9;
      
      return {
        success,
        messageId: success ? `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : undefined,
        error: success ? undefined : 'Failed to deliver message'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}