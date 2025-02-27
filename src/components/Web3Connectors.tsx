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
    <div className="connector">
      <label>{getConnectorName(connector)}</label>
      <button onClick={onClick} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
        {isActive ? 'Disconnect' : 'Connect'}
      </button>
      <svg className={`status ${isActive ? 'active' : ''}`} viewBox="0 0 2 2" width="10" height="10">
        <circle cx={1} cy={1} r={1} />
      </svg>
      <style jsx>{`
        .connector {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .status {
          width: 10px;
          height: 10px;
          fill: #f44336;
        }
        .status.active {
          fill: #4caf50;
        }
      `}</style>
    </div>
  )
}

export default function Web3Connectors() {
  return (
    <div className="connectors">
      {connectors.map((web3Connector, index) => (
        <Connector key={index} web3Connector={web3Connector} />
      ))}
      <style jsx>{`
        .connectors {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  )
}