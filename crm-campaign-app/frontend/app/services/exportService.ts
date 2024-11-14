import prisma from '@/lib/prisma';
import { Parser } from 'json2csv';

export class ExportService {
  static async exportCampaignData(campaignId: string, format: 'csv' | 'json') {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        segment: true,
        communicationLogs: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const data = campaign.communicationLogs.map(log => ({
      messageId: log.messageId,
      customerName: log.customer.name,
      customerEmail: log.customer.email,
      status: log.status,
      sentAt: log.sentAt,
      error: log.error || '',
    }));

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    const fields = ['messageId', 'customerName', 'customerEmail', 'status', 'sentAt', 'error'];
    const parser = new Parser({ fields });
    return parser.parse(data);
  }
}