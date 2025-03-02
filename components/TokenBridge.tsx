// components/TokenBridge.tsx
import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId, useConfig, useSendTransaction, usePrepareSendTransaction, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { parseUnits } from 'viem'
import { chains, tokenList, initWormhole, getTokenDecimals, getTokenAddress, isNativeToken, chainConfigs } from '../utils/wormhole'
import { erc20Abi } from 'wagmi'

export default function TokenBridge() {
  // Wallet connection state
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const config = useConfig()

  // Form state
  const [sourceChain, setSourceChain] = useState(chains[0])
  const [destChain, setDestChain] = useState(chains[1])
  const [token, setToken] = useState(tokenList[0])
  const [amount, setAmount] = useState('')
  
  // Bridge state
  const [wh, setWh] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [transferData, setTransferData] = useState(null)

  // Initialize Wormhole SDK
  useEffect(() => {
    const init = async () => {
      try {
        // Use environment variable or fallback to placeholder
        const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY || 'YOUR_INFURA_KEY'
        const wormhole = await initWormhole(infuraKey)
        setWh(wormhole)
      } catch (err) {
        console.error('Failed to initialize Wormhole:', err)
        setError('Failed to initialize Wormhole')
      }
    }

    if (isConnected) {
      init()
    }
  }, [isConnected])

  // Reset error when form changes
  useEffect(() => {
    setError('')
    setStatus('')
    setTransferData(null)
  }, [sourceChain, destChain, token, amount])

  // Check if source chain matches current network
  const isCorrectNetwork = chainId === chainConfigs[sourceChain]?.networkId

  // ERC20 Token approval preparation
  const { config: approvalConfig, error: approvalPrepareError } = usePrepareContractWrite({
    address: getTokenAddress(token, sourceChain),
    abi: erc20Abi,
    functionName: 'approve',
    args: [
      transferData?.tokenBridgeAddress || '0x0', 
      transferData?.parsedAmount || 0n
    ],
    enabled: !!(transferData && !isNativeToken(token) && isCorrectNetwork),
  })

  const { 
    data: approvalData, 
    write: approveToken,
    isLoading: isApproving,
    error: approvalWriteError,
  } = useContractWrite(approvalConfig)

  // Wait for approval transaction
  const { isSuccess: isApprovalSuccess, error: approvalWaitError } = useWaitForTransaction({
    hash: approvalData?.hash,
    enabled: !!approvalData?.hash,
  })

  // Prepare native token transfer
  const { config: sendConfig } = usePrepareSendTransaction({
    to: transferData?.tokenBridgeAddress || '0x0',
    value: transferData?.parsedAmount || 0n,
    data: transferData?.transferData || '0x',
    enabled: !!(transferData && isNativeToken(token) && isCorrectNetwork),
  })
  
  const { 
    data: sendData, 
    sendTransaction,
    isLoading: isSending 
  } = useSendTransaction(sendConfig)

  // Wait for native token transfer transaction
  const { isSuccess: isSendSuccess } = useWaitForTransaction({
    hash: sendData?.hash,
    enabled: !!sendData?.hash,
  })

  // ERC20 transfer preparation
  const { config: transferConfig } = usePrepareContractWrite({
    address: transferData?.tokenBridgeAddress || '0x0',
    abi: [{
      name: 'transferTokens',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'recipientChain', type: 'uint16' },
        { name: 'recipient', type: 'bytes32' },
        { name: 'arbiterFee', type: 'uint256' },
        { name: 'nonce', type: 'uint32' },
      ],
      outputs: [{ name: 'sequence', type: 'uint64' }]
    }],
    functionName: 'transferTokens',
    args: transferData?.tokenTransferArgs || [],
    enabled: !!(transferData && !isNativeToken(token) && isApprovalSuccess && isCorrectNetwork),
  })

  const { 
    data: transferData2, 
    write: executeTransfer,
    isLoading: isTransferring 
  } = useContractWrite(transferConfig)

  // Wait for token transfer transaction
  const { isSuccess: isTransferSuccess } = useWaitForTransaction({
    hash: transferData2?.hash,
    enabled: !!transferData2?.hash,
  })

  // Prepare transfer data
  const prepareTransfer = async () => {
    if (!wh || !address || !isConnected) return
    
    // Input validation
    if (sourceChain === destChain) {
      setError('Source and destination chains must be different')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    if (!isCorrectNetwork) {
      setError(`Please switch to ${sourceChain} network`)
      return
    }

    try {
      setStatus('Preparing transfer...')
      setError('')

      // Get decimal-adjusted amount
      const decimals = getTokenDecimals(token)
      let parsedAmount
      
      try {
        parsedAmount = parseUnits(amount, decimals)
      } catch (err) {
        throw new Error(`Invalid amount: ${err.message}`)
      }
      
      // Get token address
      const tokenAddress = getTokenAddress(token, sourceChain)
      if (!tokenAddress) {
        throw new Error(`${token} not supported on ${sourceChain}`)
      }

      // Get token bridge contract address
      const tokenBridgeAddress = chainConfigs[sourceChain]?.tokenBridgeAddress
      if (!tokenBridgeAddress) {
        throw new Error(`Token bridge not available on ${sourceChain}`)
      }

      setStatus('Preparing transaction data...')
      
      // Initialize Wormhole context for the chains
      const sourceChainContext = wh.getChain(sourceChain)
      const destChainContext = wh.getChain(destChain)
      
      // Create recipient bytes32 address from user's address
      const recipientAddress = `0x000000000000000000000000${address.slice(2)}`
      
      // Prepare transaction data based on token type
      if (isNativeToken(token)) {
        // For native tokens (ETH)
        setStatus('Preparing native token transfer...')
        
        const transferData = '0x' // This would be the encoded call to wrapAndTransferETH
        
        setTransferData({
          tokenBridgeAddress,
          parsedAmount,
          transferData,
          isNative: true
        })
      } else {
        // For ERC20 tokens
        setStatus('Preparing token transfer...')
        
        // Arguments for transferTokens function
        const tokenTransferArgs = [
          tokenAddress,                      // token address
          parsedAmount,                      // amount
          chainConfigs[destChain]?.id || 0,  // recipient chain
          recipientAddress,                  // recipient address as bytes32
          0n,                                // arbiter fee (usually 0)
          Math.floor(Math.random() * 100000) // nonce (random number)
        ]
        
        setTransferData({
          tokenBridgeAddress,
          parsedAmount,
          tokenTransferArgs,
          isNative: false
        })
      }

      setStatus('Ready to transfer. Please approve and confirm transactions.')
    } catch (err) {
      console.error(err)
      setError(`Transfer preparation failed: ${err.message}`)
      setStatus('')
    }
  }

  // Handle transfer execution
  const handleTransfer = () => {
    if (!transferData) {
      prepareTransfer()
      return
    }
    
    if (transferData.isNative) {
      if (sendTransaction) {
        sendTransaction()
        setStatus('Sending native tokens...')
      }
    } else {
      if (!isApprovalSuccess && approveToken) {
        approveToken()
        setStatus('Approving tokens...')
      } else if (isApprovalSuccess && executeTransfer) {
        executeTransfer()
        setStatus('Executing token transfer...')
      }
    }
  }

  // Handle successful transfer
  useEffect(() => {
    if (isSendSuccess || isTransferSuccess) {
      setStatus('Transfer initiated! The tokens will arrive on the destination chain after attestation (usually 5-15 minutes).')
    }
  }, [isSendSuccess, isTransferSuccess])

  // Handle all errors
  useEffect(() => {
    const errors = [
      approvalPrepareError, 
      approvalWriteError, 
      approvalWaitError
    ].filter(Boolean)
    
    if (errors.length > 0) {
      console.error(errors)
      setError(`Transaction error: ${errors[0].message}`)
    }
  }, [approvalPrepareError, approvalWriteError, approvalWaitError])

  return (
    <div className="container">
      <ConnectButton />
      
      <div className="form">
        <h1>TOKEN BRIDGE</h1>
        
        <div className="selector-group">
          <select 
            value={sourceChain} 
            onChange={(e) => setSourceChain(e.target.value)}
          >
            {chains.map(chain => (
              <option key={chain} value={chain}>{chain}</option>
            ))}
          </select>
          
          <span>→</span>
          
          <select 
            value={destChain}
            onChange={(e) => setDestChain(e.target.value)}
          >
            {chains.map(chain => (
              <option key={chain} value={chain}>{chain}</option>
            ))}
          </select>
        </div>

        <select 
          value={token}
          onChange={(e) => setToken(e.target.value)}
        >
          {tokenList.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          min="0"
          step="0.01"
        />

        <button 
          onClick={handleTransfer}
          disabled={!isConnected || !amount || (isApproving || isSending || isTransferring)}
        >
          {!transferData 
            ? 'TRANSFER' 
            : transferData.isNative 
              ? (isSending ? 'SENDING...' : 'CONFIRM TRANSFER') 
              : (!isApprovalSuccess ? (isApproving ? 'APPROVING...' : 'APPROVE') : (isTransferring ? 'TRANSFERRING...' : 'CONFIRM TRANSFER'))}
        </button>

        {!isCorrectNetwork && isConnected && (
          <div className="error">Please switch to {sourceChain} network</div>
        )}
        
        {status && <div className="status">{status}</div>}
        {error && <div className="error">{error}</div>}
        
        {(isSendSuccess || isTransferSuccess) && (
          <div className="status">
            <div>Transfer successfully initiated!</div>
            <div>Your tokens will arrive at the destination chain after attestation (usually 5-15 minutes).</div>
          </div>
        )}
      </div>
    </div>
  )
}