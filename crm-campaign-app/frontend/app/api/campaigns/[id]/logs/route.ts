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

    // Get campaign logs with statistics
    const logs = await prisma.communicationLog.findMany({
      where: {
        campaignId: params.id,
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Calculate statistics
    const stats = {
      total: logs.length,
      sent: logs.filter(log => log.status === 'SENT').length,
      failed: logs.filter(log => log.status === 'FAILED').length,
      pending: logs.filter(log => log.status === 'PENDING').length,
    };

    return NextResponse.json({ logs, stats });
  } catch (error) {
    console.error('Error fetching campaign logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}