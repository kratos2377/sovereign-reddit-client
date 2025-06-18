'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createNewUserBankModuleAccount, createUser } from '../services/sovereign-api';
import { BasicSigner } from '../services/signer';
import { chainHash } from '../services/sovereign-api';
import * as ed25519 from '@noble/ed25519';
import { useStore } from '../store/useStore';
import { addressFromPublicKey } from '@sovereign-sdk/web3';

export default function Login() {
  const router = useRouter();
  const { setUserCredentials } = useStore();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingCredentials, setIsCheckingCredentials] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    const checkExistingCredentials = async () => {
      try {
        const storedPrivateKey = localStorage.getItem('privateKey');
        const storedUsername = localStorage.getItem('username');
        
        if (storedPrivateKey && storedUsername) {
          const privateKeyBytes = new Uint8Array(JSON.parse(storedPrivateKey));
          const signer = await BasicSigner.fromPrivateKeyBytes(privateKeyBytes, chainHash);
          const pubKey = await signer.publicKey();
          const pubKeyHex = ed25519.etc.bytesToHex(pubKey).replace(/^0x/, '');
          setPublicKey(pubKeyHex);
          setUsername(storedUsername);
          setUserCredentials(storedUsername, privateKeyBytes, pubKeyHex);
          // Redirect to home page if we have valid credentials
          router.push('/home');
        }
      } catch (err) {
        console.error('Error loading existing credentials:', err);
        // Clear invalid credentials
        localStorage.removeItem('privateKey');
        localStorage.removeItem('username');
      } finally {
        setIsCheckingCredentials(false);
      }
    };

    checkExistingCredentials();
  }, [router, setUserCredentials]);

  const generatePrivateKey = () => {
    // Generate a random 32-byte array
    const privateKey = new Uint8Array(32);
    crypto.getRandomValues(privateKey);
    return privateKey;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const privateKey = generatePrivateKey();
      const signer = await BasicSigner.fromPrivateKeyBytes(privateKey, chainHash);
      const pubKey = await signer.publicKey();
      const pubKeyHex = ed25519.etc.bytesToHex(pubKey).replace(/^0x/, '');

      // console.log("Creating new user bank module account")
      // await createNewUserBankModuleAccount(signer)

      console.log("Creating user")
      // Create user with the generated signer
      await createUser(username, signer);
      
      // Store the private key in localStorage for future use
      localStorage.setItem('privateKey', JSON.stringify(Array.from(privateKey)));
      localStorage.setItem('username', username);
      
      // Update store with credentials
      setUserCredentials(username, privateKey, pubKeyHex);
      
      // Redirect to home page
      router.push('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left side - SVG and App Name */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-indigo-600 p-8">
        <div className="max-w-md">
          <svg
            className="w-full h-auto mb-8"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M200 50C122.5 50 60 112.5 60 190C60 267.5 122.5 330 200 330C277.5 330 340 267.5 340 190C340 112.5 277.5 50 200 50ZM200 290C144.5 290 100 245.5 100 190C100 134.5 144.5 90 200 90C255.5 90 300 134.5 300 190C300 245.5 255.5 290 200 290Z"
              fill="white"
            />
            <circle cx="200" cy="190" r="40" fill="white" />
          </svg>
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Sovereign Reddit
          </h1>
          <p className="text-white text-center text-lg">
            Your decentralized social platform
          </p>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="bg-white p-12 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-8 text-center">Create Account</h2>
          
          {isCheckingCredentials ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              {publicKey && (
                <div className="mb-8 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-2">Your Public Key:</p>
                  <p className="text-xs font-mono break-all text-gray-600">{publicKey}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}