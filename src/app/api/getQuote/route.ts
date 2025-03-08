// src/app/api/getQuote/route.ts
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { Token, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';
import { Protocol } from '@uniswap/router-sdk';

const CHAIN_ID = 1;
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const amountIn = searchParams.get('amountIn');

  console.log('Request received with amountIn:', amountIn);

  if (!amountIn || isNaN(Number(amountIn))) {
    console.log('Invalid amountIn:', amountIn);
    return NextResponse.json({ error: 'Invalid or missing amountIn' }, { status: 400 });
  }

  try {
    const alchemyKey = process.env.ALCHEMY_KEY || 'sgd3N8JnssdBdF6c9c1BZ-BRMx084YDk'; // Fallback to hardcoded key
    const alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`;
    console.log('Attempting to connect to Alchemy with URL:', alchemyUrl.replace(alchemyKey, '[REDACTED]'));

    const provider = new ethers.providers.JsonRpcProvider({
      url: alchemyUrl,
      skipFetchSetup: true,
    });

    console.log('Testing provider connection...');
    const blockNumber = await provider.getBlockNumber();
    console.log('Connected to Alchemy, block number:', blockNumber);

    const WETH = new Token(CHAIN_ID, WETH_ADDRESS, 18, 'WETH', 'Wrapped Ether');
    const USDC = new Token(CHAIN_ID, USDC_ADDRESS, 6, 'USDC', 'USD Coin');

    const router = new AlphaRouter({ chainId: CHAIN_ID, provider });

    const amountInWei = ethers.utils.parseEther(amountIn);
    const currencyAmountIn = CurrencyAmount.fromRawAmount(WETH, amountInWei.toString());

    console.log('Routing quote...');
    const route = await router.route(
      currencyAmountIn,
      USDC,
      TradeType.EXACT_INPUT,
      {
        type: SwapType.SWAP_ROUTER_02,
        recipient: '0x0000000000000000000000000000000000000000',
        slippageTolerance: new Percent(50, 10000),
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        protocols: [Protocol.V2, Protocol.V3, Protocol.MIXED],
      }
    );

    if (!route) {
      console.error('No route found');
      return NextResponse.json({ error: 'No route found' }, { status: 500 });
    }

    console.log('Quote retrieved:', route.quote.toSignificant(6));
    return NextResponse.json({ amountOut: route.quote.toSignificant(6) });
  } catch (error) {
    console.error('Error in getQuote:', error.message);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    return NextResponse.json({ error: error.message || 'Failed to fetch quote' }, { status: 500 });
  }
}