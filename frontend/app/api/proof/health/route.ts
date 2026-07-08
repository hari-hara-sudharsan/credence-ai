import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    contracts: "ONLINE",
    oracle: "ONLINE",
    hsp: "CONNECTED"
  });
}
