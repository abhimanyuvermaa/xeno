import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ExportService } from '@/app/services/exportService';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const format = url.searchParams.get('format') as 'csv' | 'json' || 'csv';
    
    const data = await ExportService.exportCampaignData(params.id, format);
    
    const headers = new Headers();
    headers.set('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
    headers.set('Content-Disposition', `attachment; filename=campaign-${params.id}.${format}`);

    return new NextResponse(data, { headers });
  } catch (error) {
    console.error('Error exporting campaign data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}