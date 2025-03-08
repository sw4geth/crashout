// src/app/api/getQuote/route.ts
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { Token, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';

const CHAIN_ID = 1;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const amountIn = searchParams.get('amountIn');
  const inputTokenAddress = searchParams.get('inputToken');
  const outputTokenAddress = searchParams.get('outputToken');
  const inputDecimals = Number(searchParams.get('inputDecimals'));
  const outputDecimals = Number(searchParams.get('outputDecimals'));

  console.log('Request:', { amountIn, inputTokenAddress, outputTokenAddress, inputDecimals, outputDecimals });

  if (!amountIn || !inputTokenAddress || !outputTokenAddress || isNaN(inputDecimals) || isNaN(outputDecimals)) {
    console.log('Invalid params');
    return NextResponse.json({ error: 'Invalid or missing parameters' }, { status: 400 });
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider({
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY || 'sgd3N8JnssdBdF6c9c1BZ-BRMx084YDk'}`,
      skipFetchSetup: true,
    });

    console.log('Provider connected, block:', await provider.getBlockNumber());

    const inputToken = new Token(CHAIN_ID, inputTokenAddress, inputDecimals);
    const outputToken = new Token(CHAIN_ID, outputTokenAddress, outputDecimals);

    const router = new AlphaRouter({ chainId: CHAIN_ID, provider });

    const currencyAmountIn = CurrencyAmount.fromRawAmount(inputToken, amountIn);

    console.log('Routing:', { input: inputTokenAddress, output: outputTokenAddress });

    const route = await router.route(
      currencyAmountIn,
      outputToken,
      TradeType.EXACT_INPUT,
      {
        type: SwapType.SWAP_ROUTER_02,
        recipient: '0x0000000000000000000000000000000000000000',
        slippageTolerance: new Percent(50, 10000), // 0.5%
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes
      }
    );

    if (!route) {
      console.log('No route found');
      return NextResponse.json({ error: 'No route found for this token pair' }, { status: 404 });
    }

    console.log('Quote:', route.quote.toSignificant(6));
    return NextResponse.json({ amountOut: route.quote.toSignificant(6) });
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quote', details: error.stack },
      { status: 500 }
    );
  }
}