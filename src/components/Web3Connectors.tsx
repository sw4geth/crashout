'use client'

import { useCallback } from 'react'
import { connectors, getConnectorName, Web3Connector } from '../connectors'

function Connector({ web3Connector }: { web3Connector: Web3Connector }) {
  const [connector, hooks] = web3Connector
  const isActive = hooks.useIsActive()
  const onClick = useCallback(() => {
    if (isActive) {
      connector.deactivate()
    } else {
      connectors.forEach(([connector]) => connector.deactivate())
      connector.activate()
    }
  }, [connector, isActive])

  return (
    <div className="flex items-center justify-between mb-3 p-3 bg-black/70 border border-white/20 rounded-md">
      <label className="text-white font-mono">{getConnectorName(connector)}</label>
      <div className="flex items-center">
        <button 
          onClick={onClick}
          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-white text-sm mr-2 transition-colors font-mono"
        >
          {isActive ? 'Disconnect' : 'Connect'}
        </button>
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`} />
      </div>
    </div>
  )
}

export default function Web3Connectors() {
  return (
    <div className="space-y-2">
      {connectors.map((web3Connector, index) => (
        <Connector key={index} web3Connector={web3Connector} />
      ))}
    </div>
  )
}