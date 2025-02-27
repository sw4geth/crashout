import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'
import { Connector } from '@web3-react/types'
import { JSON_RPC_URL } from '../constants'

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        rpc: { 1: JSON_RPC_URL },
      },
    })
)

export function isWalletConnect(connector: Connector) {
  return connector instanceof WalletConnect
}

export default [walletConnect, hooks]