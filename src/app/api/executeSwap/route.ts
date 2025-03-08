// src/app/api/executeSwap/route.ts
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { Token, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';

const CHAIN_ID = 1;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      amountIn, 
      inputTokenAddress, 
      outputTokenAddress, 
      inputDecimals, 
      outputDecimals,
      walletAddress
    } = body;

    console.log('Swap Request:', { 
      amountIn, 
      inputTokenAddress, 
      outputTokenAddress, 
      inputDecimals, 
      outputDecimals,
      walletAddress
    });

    if (!amountIn || !inputTokenAddress || !outputTokenAddress || 
        isNaN(inputDecimals) || isNaN(outputDecimals) || !walletAddress) {
      console.log('Invalid params');
      return NextResponse.json({ error: 'Invalid or missing parameters' }, { status: 400 });
    }

    const provider = new ethers.providers.JsonRpcProvider({
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY || 'sgd3N8JnssdBdF6c9c1BZ-BRMx084YDk'}`,
      skipFetchSetup: true,
    });

    const inputToken = new Token(CHAIN_ID, inputTokenAddress, inputDecimals);
    const outputToken = new Token(CHAIN_ID, outputTokenAddress, outputDecimals);

    const router = new AlphaRouter({ chainId: CHAIN_ID, provider });

    const currencyAmountIn = CurrencyAmount.fromRawAmount(inputToken, amountIn);

    const route = await router.route(
      currencyAmountIn,
      outputToken,
      TradeType.EXACT_INPUT,
      {
        type: SwapType.SWAP_ROUTER_02,
        recipient: walletAddress,
        slippageTolerance: new Percent(50, 10000), // 0.5%
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes
      }
    );

    if (!route) {
      console.log('No route found');
      return NextResponse.json({ error: 'No route found for this token pair' }, { status: 404 });
    }

    // In a real implementation, we would execute the swap here
    // This would require the user's signature and a connected wallet
    // For now, we'll return the transaction data that would be needed
    
    return NextResponse.json({ 
      success: true,
      amountOut: route.quote.toSignificant(6),
      route: {
        methodParameters: route.methodParameters,
        tokenInAddress: inputTokenAddress,
        tokenOutAddress: outputTokenAddress,
        amountIn: amountIn,
        quote: route.quote.toSignificant(6),
        gasEstimate: route.estimatedGasUsed.toString(),
        txData: route.methodParameters?.calldata || '',
        txTarget: route.methodParameters?.to || '',
        txValue: route.methodParameters?.value || '0'
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error.message || 'Failed to execute swap', details: error.stack },
      { status: 500 }
    );
  }
}
