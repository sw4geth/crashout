// src/app/api/getQuote/route.ts
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { Token, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';
import { Protocol } from '@uniswap/router-sdk';

const CHAIN_ID = 1;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const amountIn = searchParams.get('amountIn'); // Raw amount (e.g., "1000000" for 1 USDC)
  const inputTokenAddress = searchParams.get('inputToken');
  const outputTokenAddress = searchParams.get('outputToken');
  const inputDecimals = Number(searchParams.get('inputDecimals')); // Added from client
  const outputDecimals = Number(searchParams.get('outputDecimals')); // Added from client

  console.log('Request received:', { amountIn, inputTokenAddress, outputTokenAddress, inputDecimals, outputDecimals });

  if (!amountIn || !inputTokenAddress || !outputTokenAddress || isNaN(inputDecimals) || isNaN(outputDecimals)) {
    console.log('Invalid params:', { amountIn, inputTokenAddress, outputTokenAddress, inputDecimals, outputDecimals });
    return NextResponse.json({ error: 'Invalid or missing parameters' }, { status: 400 });
  }

  try {
    const alchemyKey = process.env.ALCHEMY_KEY || 'sgd3N8JnssdBdF6c9c1BZ-BRMx084YDk';
    const alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`;
    console.log('Connecting to Alchemy with URL:', alchemyUrl.replace(alchemyKey, '[REDACTED]'));

    const provider = new ethers.providers.JsonRpcProvider({
      url: alchemyUrl,
      skipFetchSetup: true,
    });

    console.log('Testing provider connection...');
    const blockNumber = await provider.getBlockNumber();
    console.log('Connected to Alchemy, block number:', blockNumber);

    const inputToken = new Token(CHAIN_ID, inputTokenAddress, inputDecimals);
    const outputToken = new Token(CHAIN_ID, outputTokenAddress, outputDecimals);

    const router = new AlphaRouter({ chainId: CHAIN_ID, provider });

    const currencyAmountIn = CurrencyAmount.fromRawAmount(inputToken, amountIn);

    console.log('Routing quote...');
    const route = await router.route(
      currencyAmountIn,
      outputToken,
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