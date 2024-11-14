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

    const segment = await prisma.segment.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!segment) {
      return NextResponse.json({ error: 'Segment not found' }, { status: 404 });
    }

    return NextResponse.json(segment);
  } catch (error) {
    console.error('Error fetching segment:', error);
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
    const { name, description, rules } = body;

    const segment = await prisma.segment.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        name,
        description,
        rules,
      },
    });

    return NextResponse.json(segment);
  } catch (error) {
    console.error('Error updating segment:', error);
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

    // Check if segment exists and belongs to user
    const segment = await prisma.segment.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!segment) {
      return NextResponse.json({ error: 'Segment not found' }, { status: 404 });
    }

    // Check if segment is being used in any campaigns
    const campaignsUsingSegment = await prisma.campaign.findFirst({
      where: {
        segmentId: params.id,
      },
    });

    if (campaignsUsingSegment) {
      return NextResponse.json(
        { error: 'Cannot delete segment that is being used in campaigns' },
        { status: 400 }
      );
    }

    // Delete the segment
    await prisma.segment.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting segment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}