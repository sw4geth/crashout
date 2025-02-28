import { useState, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from '@wagmi/connectors';
import { ethers } from 'ethers';
import { useDropzone } from 'react-dropzone';

// Import our simplified IPFS client
import ipfsClient from '../lib/ipfsClient';

// Story Protocol contract details
const REGISTRATION_WORKFLOWS_ADDRESS = '0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424'; // Aeneid Testnet
const REGISTRATION_WORKFLOWS_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "symbol", "type": "string" },
          { "internalType": "string", "name": "baseURI", "type": "string" },
          { "internalType": "string", "name": "contractURI", "type": "string" },
          { "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
          { "internalType": "uint256", "name": "mintFee", "type": "uint256" },
          { "internalType": "address", "name": "mintFeeToken", "type": "address" },
          { "internalType": "address", "name": "mintFeeRecipient", "type": "address" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "bool", "name": "mintOpen", "type": "bool" },
          { "internalType": "bool", "name": "isPublicMinting", "type": "bool" }
        ],
        "internalType": "struct ISPGNFT.InitParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "createCollection",
    "outputs": [{ "internalType": "address", "name": "spgNftContract", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spgNftContract", "type": "address" },
      { "internalType": "address", "name": "recipient", "type": "address" },
      {
        "components": [
          { "internalType": "string", "name": "ipMetadataURI", "type": "string" },
          { "internalType": "bytes32", "name": "ipMetadataHash", "type": "bytes32" },
          { "internalType": "string", "name": "nftMetadataURI", "type": "string" },
          { "internalType": "bytes32", "name": "nftMetadataHash", "type": "bytes32" }
        ],
        "internalType": "struct WorkflowStructs.IPMetadata",
        "name": "ipMetadata",
        "type": "tuple"
      },
      { "internalType": "bool", "name": "registerIp", "type": "bool" }
    ],
    "name": "mintAndRegisterIp",
    "outputs": [
      { "internalType": "address", "name": "ipId", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export default function MintNFT() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Collection state
  const [collectionName, setCollectionName] = useState('My NFT Collection');
  const [collectionSymbol, setCollectionSymbol] = useState('MYNFT');
  const [spgNftContract, setSpgNftContract] = useState<string | null>(null);
  
  // NFT state
  const [nftName, setNftName] = useState('My Awesome NFT');
  const [nftDescription, setNftDescription] = useState('This is a description of my awesome NFT');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [metadataURI, setMetadataURI] = useState('');
  
  // Status state
  const [loading, setLoading] = useState(false);
  const [uploadingToIpfs, setUploadingToIpfs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [ipId, setIpId] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [step, setStep] = useState<'collection' | 'upload' | 'mint'>('collection');

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Create preview for image files
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxSize: 5242880, // 5MB
  });

  // Upload file to IPFS
  const uploadToIPFS = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return null;
    }
    
    try {
      setUploadingToIpfs(true);
      setError(null);
      
      // Upload file to IPFS
      const fileAdded = await ipfsClient.add(file);
      const fileUrl = `https://ipfs.io/ipfs/${fileAdded.path}`;
      
      // Create metadata
      const metadata: NFTMetadata = {
        name: nftName,
        description: nftDescription,
        image: fileUrl,
        attributes: [
          { trait_type: 'Created By', value: address || 'Unknown' }
        ]
      };
      
      // Upload metadata to IPFS
      const metadataAdded = await ipfsClient.add(JSON.stringify(metadata));
      const metadataUrl = `https://ipfs.io/ipfs/${metadataAdded.path}`;
      
      setMetadataURI(metadataUrl);
      return metadataUrl;
    } catch (err) {
      console.error('Error uploading to IPFS:', err);
      setError(`Error uploading to IPFS: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    } finally {
      setUploadingToIpfs(false);
    }
  };

  // Create NFT Collection
  const createNFTCollection = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // @ts-ignore - window.ethereum is injected by MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        REGISTRATION_WORKFLOWS_ADDRESS,
        REGISTRATION_WORKFLOWS_ABI,
        signer
      );

      const params = {
        name: collectionName,
        symbol: collectionSymbol,
        baseURI: '',
        contractURI: '',
        maxSupply: 100,
        mintFee: 0,
        mintFeeToken: ethers.constants.AddressZero,
        mintFeeRecipient: ethers.constants.AddressZero,
        owner: address,
        mintOpen: true,
        isPublicMinting: true,
      };

      const tx = await contract.createCollection(params);
      const receipt = await tx.wait();
      
      // Try to get contract address from events, fallback to transaction destination
      const spgNftContractAddress = receipt.events?.find((e: any) => e.event === 'CollectionCreated')?.args?.spgNftContract || tx.to;
      setSpgNftContract(spgNftContractAddress);
      setTxHash(tx.hash);
      setStep('upload');
      
      console.log(`New NFT collection created at: ${spgNftContractAddress}`);
    } catch (err) {
      console.error('Error creating collection:', err);
      setError(`Error creating collection: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Mint NFT and Register IP
  const mintAndRegisterIp = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    if (!spgNftContract) {
      setError('Please create a collection first');
      return;
    }
    
    // First upload to IPFS if needed
    let uri = metadataURI;
    if (!uri) {
      setError('Uploading to IPFS...');
      uri = await uploadToIPFS();
      if (!uri) return; // uploadToIPFS sets error state
    }

    try {
      setLoading(true);
      setError(null);

      // @ts-ignore - window.ethereum is injected by MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        REGISTRATION_WORKFLOWS_ADDRESS,
        REGISTRATION_WORKFLOWS_ABI,
        signer
      );

      const ipMetadata = {
        ipMetadataURI: uri,
        ipMetadataHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify({ title: nftName }))),
        nftMetadataURI: uri,
        nftMetadataHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify({ name: nftName }))),
      };

      const tx = await contract.mintAndRegisterIp(
        spgNftContract,
        address,
        ipMetadata,
        true
      );

      const receipt = await tx.wait();
      setTxHash(tx.hash);

      // Extract ipId and tokenId from events
      const event = receipt.events?.find((e: any) => e.event === 'IPRegistered');
      if (event) {
        setIpId(event.args.ipId);
        setTokenId(event.args.tokenId.toString());
      }

      console.log('IP Asset Minted! Transaction Hash:', tx.hash);
    } catch (err) {
      console.error('Error minting NFT:', err);
      setError(`Error minting NFT: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">NFT Minter on Story Protocol</h1>
      
      {!isConnected ? (
        <div className="text-center">
          <button
            onClick={() => connect({ connector: injected() })}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
            </p>
            <button
              onClick={() => disconnect()}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Disconnect
            </button>
          </div>
          
          {/* Step navigation */}
          <div className="flex mb-6">
            <button
              onClick={() => setStep('collection')}
              className={`flex-1 py-2 ${step === 'collection' ? 'border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
            >
              1. Create Collection
            </button>
            <button
              onClick={() => spgNftContract && setStep('upload')}
              className={`flex-1 py-2 ${step === 'upload' ? 'border-b-2 border-blue-600 font-medium' : 'text-gray-500'} ${!spgNftContract ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!spgNftContract}
            >
              2. Upload Asset
            </button>
            <button
              onClick={() => (spgNftContract && metadataURI) && setStep('mint')}
              className={`flex-1 py-2 ${step === 'mint' ? 'border-b-2 border-blue-600 font-medium' : 'text-gray-500'} ${!(spgNftContract && metadataURI) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!(spgNftContract && metadataURI)}
            >
              3. Mint NFT
            </button>
          </div>
          
          {/* Create Collection Step */}
          {step === 'collection' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Create NFT Collection</h2>
              
              <div>
                <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700">Collection Name</label>
                <input
                  id="collectionName"
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="collectionSymbol" className="block text-sm font-medium text-gray-700">Collection Symbol</label>
                <input
                  id="collectionSymbol"
                  type="text"
                  value={collectionSymbol}
                  onChange={(e) => setCollectionSymbol(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                onClick={createNFTCollection}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {loading ? 'Creating...' : 'Create Collection'}
              </button>
              
              {spgNftContract && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-800">
                    Collection created at: <span className="font-mono">{spgNftContract}</span>
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Upload Asset Step */}
          {step === 'upload' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Asset</h2>
              
              <div>
                <label htmlFor="nftName" className="block text-sm font-medium text-gray-700">NFT Name</label>
                <input
                  id="nftName"
                  type="text"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="nftDescription" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="nftDescription"
                  value={nftDescription}
                  onChange={(e) => setNftDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image (max 5MB)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  {filePreview ? (
                    <div>
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="mx-auto max-h-48 mb-2"
                      />
                      <p className="text-sm text-gray-500">{file?.name} ({(file?.size / 1024).toFixed(0)} KB)</p>
                      <p className="text-xs text-blue-600 mt-2">Click or drag to replace</p>
                    </div>
                  ) : isDragActive ? (
                    <p className="text-blue-600">Drop the file here...</p>
                  ) : (
                    <div>
                      <svg 
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor" 
                        fill="none" 
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Drag and drop an image, or click to select
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG, GIF, WEBP up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={uploadToIPFS}
                  disabled={!file || uploadingToIpfs}
                  className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {uploadingToIpfs ? 'Uploading...' : 'Upload to IPFS'}
                </button>
                
                <button
                  onClick={() => setStep('mint')}
                  disabled={!metadataURI}
                  className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
                >
                  Continue to Mint
                </button>
              </div>
              
              {metadataURI && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-800">
                    Metadata uploaded to IPFS
                  </p>
                  <p className="text-xs font-mono break-all mt-1">
                    {metadataURI}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Mint NFT Step */}
          {step === 'mint' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Mint NFT</h2>
              
              {filePreview && (
                <div className="text-center mb-4">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="mx-auto max-h-48 mb-2 rounded-lg shadow-sm"
                  />
                  <p className="text-lg font-medium">{nftName}</p>
                  <p className="text-sm text-gray-600">{nftDescription}</p>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm">
                  <span className="font-medium">Collection:</span> {collectionName} ({collectionSymbol})
                </p>
                <p className="text-sm font-mono text-xs break-all mt-1">
                  <span className="font-medium text-gray-700">Address:</span> {spgNftContract}
                </p>
                <p className="text-sm font-mono text-xs break-all mt-1">
                  <span className="font-medium text-gray-700">Metadata:</span> {metadataURI}
                </p>
              </div>
              
              <button
                onClick={mintAndRegisterIp}
                disabled={loading}
                className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
              >
                {loading ? 'Minting...' : 'Mint NFT and Register IP'}
              </button>
              
              {ipId && tokenId && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="text-lg font-medium text-green-800 mb-2">Success! Your NFT has been minted</h3>
                  <p className="text-sm">
                    <span className="font-medium">IP Asset ID:</span> {ipId}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Token ID:</span> {tokenId}
                  </p>
                  {txHash && (
                    <a
                      href={`https://aeneid.storyscan.xyz/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-blue-600 hover:text-blue-800"
                    >
                      View on Storyscan Explorer →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Error display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}