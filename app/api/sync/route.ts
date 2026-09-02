import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory server store for persistent syncing during server lifecycle
let serverSyncLog: Array<{
  id: string;
  type: string;
  payload: any;
  receivedAt: string;
  sourceIp?: string;
}> = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, singleItem, userSession } = body;

    const timestamp = new Date().toISOString();
    const incomingItems = items || (singleItem ? [singleItem] : []);

    for (const item of incomingItems) {
      serverSyncLog.unshift({
        id: item.id || `srv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: item.type || 'DATA_SYNC',
        payload: item.payload || item,
        receivedAt: timestamp,
        sourceIp: req.headers.get('x-forwarded-for') || '127.0.0.1',
      });
    }

    // Keep log bounded
    if (serverSyncLog.length > 200) {
      serverSyncLog = serverSyncLog.slice(0, 200);
    }

    return NextResponse.json({
      success: true,
      syncedCount: incomingItems.length,
      serverTime: timestamp,
      message: `${incomingItems.length} registros sincronizados e salvos no servidor via internet com sucesso.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erro ao processar sincronização',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    totalSyncedRecords: serverSyncLog.length,
    recentSyncs: serverSyncLog.slice(0, 10),
  });
}
