import prisma from '@/lib/prisma';

export interface CampaignAnalytics {
  deliveryMetrics: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
    deliveryRate: number;
  };
  timeMetrics: {
    averageDeliveryTime: number;
    peakDeliveryTime: string;
    campaignDuration: number;
  };
  customerSegmentation: {
    totalCustomers: number;
    segmentSize: number;
    segmentCoverage: number;
  };
}

export class AnalyticsService {
  static async getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics> {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        segment: true,
        communicationLogs: true,
      },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const logs = campaign.communicationLogs;
    const totalCustomers = await prisma.customer.count();

    // Calculate delivery metrics
    const deliveryMetrics = {
      total: logs.length,
      sent: logs.filter(log => log.status === 'SENT').length,
      failed: logs.filter(log => log.status === 'FAILED').length,
      pending: logs.filter(log => log.status === 'PENDING').length,
      deliveryRate: 0,
    };
    
    deliveryMetrics.deliveryRate = (deliveryMetrics.sent / deliveryMetrics.total) * 100;

    // Calculate time metrics
    const timeMetrics = {
      averageDeliveryTime: 0,
      peakDeliveryTime: '',
      campaignDuration: 0,
    };

    if (campaign.startedAt && campaign.completedAt) {
      timeMetrics.campaignDuration = 
        (campaign.completedAt.getTime() - campaign.startedAt.getTime()) / 1000; // in seconds

      // Calculate average delivery time
      const sentLogs = logs.filter(log => log.status === 'SENT' && log.sentAt);
      if (sentLogs.length > 0) {
        const totalDeliveryTime = sentLogs.reduce((acc, log) => {
          return acc + (log.sentAt!.getTime() - campaign.startedAt!.getTime());
        }, 0);
        timeMetrics.averageDeliveryTime = totalDeliveryTime / (sentLogs.length * 1000); // in seconds
      }

      // Find peak delivery time
      const deliveryTimeDistribution = new Map<string, number>();
      sentLogs.forEach(log => {
        const hour = log.sentAt!.getHours();
        deliveryTimeDistribution.set(
          `${hour}:00`,
          (deliveryTimeDistribution.get(`${hour}:00`) || 0) + 1
        );
      });

      let maxCount = 0;
      deliveryTimeDistribution.forEach((count, time) => {
        if (count > maxCount) {
          maxCount = count;
          timeMetrics.peakDeliveryTime = time;
        }
      });
    }

    // Calculate customer segmentation metrics
    const customerSegmentation = {
      totalCustomers,
      segmentSize: logs.length,
      segmentCoverage: (logs.length / totalCustomers) * 100,
    };

    return {
      deliveryMetrics,
      timeMetrics,
      customerSegmentation,
    };
  }
}