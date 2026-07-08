import { NextResponse } from 'next/server';
import contractsConfig from '../../../../../../src/config/contracts.json';

export async function GET() {
  const mainnet = contractsConfig['hashkey-mainnet'].contracts;
  
  const contractsArray = Object.entries(mainnet).map(([name, data]: [string, any]) => ({
    name,
    address: data.address,
    verified: data.verified,
    explorer: data.explorer
  }));

  return NextResponse.json({
    network: "HashKey",
    verifiedContracts: Object.keys(mainnet).length,
    status: "LIVE",
    contracts: contractsArray
  });
}
