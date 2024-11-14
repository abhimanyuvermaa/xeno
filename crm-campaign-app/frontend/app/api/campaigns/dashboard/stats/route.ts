import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get campaign statistics
    const [
      totalCampaigns,
      activeCampaigns,
      totalMessages,
      deliveredMessages,
      recentCampaigns
    ] = await Promise.all([
      prisma.campaign.count(),
      prisma.campaign.count({
        where: { status: 'IN_PROGRESS' }
      }),
      prisma.communicationLog.count(),
      prisma.communicationLog.count({
        where: { status: 'SENT' }
      }),
      prisma.campaign.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true
        }
      })
    ]);

    // Calculate delivery trend for the last 7 days
    const deliveryTrend = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return prisma.communicationLog.groupBy({
          by: ['status'],
          where: {
            createdAt: {
              gte: new Date(date.setHours(0, 0, 0, 0)),
              lt: new Date(date.setHours(23, 59, 59, 999))
            }
          },
          _count: true
        });
      })
    );

    return NextResponse.json({
      totalCampaigns,
      activeCampaigns,
      totalMessages,
      deliveryRate: totalMessages > 0 
        ? ((deliveredMessages / totalMessages) * 100).toFixed(1) 
        : 0,
      recentCampaigns: recentCampaigns.map(campaign => ({
        ...campaign,
        sentAt: campaign.createdAt
      })),
      deliveryTrend: deliveryTrend.map((day, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        return {
          date: date.toISOString().split('T')[0],
          delivered: day.find(d => d.status === 'SENT')?._count ?? 0,
          failed: day.find(d => d.status === 'FAILED')?._count ?? 0
        };
      }).reverse()
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}