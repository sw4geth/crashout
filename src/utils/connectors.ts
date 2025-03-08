import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const RPC_URLS = {
  1: 'https://cloudflare-eth.com', // Mainnet
};

export const injected = new InjectedConnector({
  supportedChainIds: [1], // Mainnet only for now
});

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  qrcode: true,
});
