import { ethers } from 'ethers';

// Singleton variables for provider and signer
let provider = null;
let signer = null;
let signerAddress = null;

export async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install a Web3 wallet like MetaMask.');
    return;
  }

  try {
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const newSigner = await browserProvider.getSigner();
    provider = browserProvider;
    signer = newSigner;
    signerAddress = await newSigner.getAddress();
    return signerAddress;
  } catch (error) {
    console.error('User rejected the request:', error);
    return null;
  }
}

// Expose provider and signer if needed
export { provider, signer, signerAddress };
