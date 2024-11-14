import prisma from '@/lib/prisma';

interface DeliveryResult {
  success: boolean;
  messageId: string;
  error?: string;
}

export class MessageDeliveryService {
  // Simulate external messaging service
  private static async sendMessage(message: any): Promise<DeliveryResult> {
    // Simulate API delay (100-500ms)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));
    
    // Simulate 90% success rate
    const success = Math.random() < 0.9;
    
    return {
      success,
      messageId: Math.random().toString(36).substring(7),
      error: success ? undefined : 'Failed to deliver message'
    };
  }

  // Process messages in batches
  static async processBatch(messages: any[], batchSize: number = 50): Promise<void> {
    const batches = [];
    for (let i = 0; i < messages.length; i += batchSize) {
      batches.push(messages.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      await Promise.all(batch.map(message => this.processMessage(message)));
    }
  }

  // Process individual message
  private static async processMessage(message: any): Promise<void> {
    try {
      // Send message
      const result = await this.sendMessage(message);

      // Update communication log
      await prisma.communicationLog.update({
        where: { id: message.id },
        data: {
          status: result.success ? 'SENT' : 'FAILED',
          error: result.error,
          messageId: result.messageId,
          sentAt: new Date(),
        },
      });

      // If successful, update campaign metrics
      if (result.success) {
        await this.updateCampaignMetrics(message.campaignId);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Update communication log with error
      await prisma.communicationLog.update({
        where: { id: message.id },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error',
          sentAt: new Date(),
        },
      });
    }
  }

  // Update campaign metrics
  private static async updateCampaignMetrics(campaignId: string): Promise<void> {
    const stats = await prisma.communicationLog.groupBy({
      by: ['status'],
      where: {
        campaignId,
      },
      _count: {
        status: true,
      },
    });

    const metrics = {
      totalSent: 0,
      totalFailed: 0,
      deliveryRate: 0,
    };

    stats.forEach(stat => {
      if (stat.status === 'SENT') metrics.totalSent = stat._count.status;
      if (stat.status === 'FAILED') metrics.totalFailed = stat._count.status;
    });

    const total = metrics.totalSent + metrics.totalFailed;
    metrics.deliveryRate = total > 0 ? (metrics.totalSent / total) * 100 : 0;

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        metrics: metrics,
        status: total === 0 ? 'IN_PROGRESS' : 'COMPLETED',
      },
    });
  }
}