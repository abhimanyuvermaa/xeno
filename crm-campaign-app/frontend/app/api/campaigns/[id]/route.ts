import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        segment: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, type, segmentId, message, scheduledDate, status } = body;

    // Verify campaign exists and belongs to user
    const existingCampaign = await prisma.campaign.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingCampaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // If segment is being changed, verify new segment exists and belongs to user
    if (segmentId && segmentId !== existingCampaign.segmentId) {
      const segment = await prisma.segment.findUnique({
        where: {
          id: segmentId,
          userId: session.user.id,
        },
      });

      if (!segment) {
        return NextResponse.json(
          { error: 'Invalid segment selected' },
          { status: 400 }
        );
      }
    }

    // Don't allow updating completed campaigns
    if (existingCampaign.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot update completed campaigns' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        name,
        description,
        type,
        segmentId,
        message,
        scheduledDate,
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Don't allow deleting campaigns that are in progress or completed
    if (['IN_PROGRESS', 'COMPLETED'].includes(campaign.status)) {
      return NextResponse.json(
        { error: 'Cannot delete campaigns that are in progress or completed' },
        { status: 400 }
      );
    }

    // Delete the campaign
    await prisma.campaign.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}