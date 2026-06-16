import { NextResponse } from 'next/server';
import { getMarketVolumeData } from '@/lib/data/market-volume';

export const revalidate = 21600; // 6 hours

export async function GET() {
  try {
    const data = await getMarketVolumeData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      totalUsd: 900_000_000_000,
      nasdaqSource: null,
      cboeSource: null,
      fetchedAt: new Date().toISOString(),
    });
  }
}
