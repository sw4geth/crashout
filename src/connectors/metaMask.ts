import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Connector } from '@web3-react/types'

export const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }))

export function isMetaMask(connector: Connector) {
  return connector instanceof MetaMask
}

export default [metaMask, hooks]