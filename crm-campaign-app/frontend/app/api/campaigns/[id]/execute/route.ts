import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { CampaignProcessor } from '@/app/services/campaignProcessor';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify campaign exists and belongs to user
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Don't allow executing completed or failed campaigns
    if (['COMPLETED', 'FAILED'].includes(campaign.status)) {
      return NextResponse.json(
        { error: 'Cannot execute completed or failed campaigns' },
        { status: 400 }
      );
    }

    // Execute campaign asynchronously
    CampaignProcessor.executeCampaign(params.id)
      .catch(error => console.error('Campaign execution error:', error));

    return NextResponse.json({ 
      message: 'Campaign execution started',
      campaignId: params.id 
    });
  } catch (error) {
    console.error('Error executing campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}