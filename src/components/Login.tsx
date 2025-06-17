'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '../services/sovereign-api';
import { BasicSigner } from '../services/signer';
import { chainHash } from '../services/sovereign-api';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      // Create user with the generated signer
      await createUser(username, signer);
      
      // Store the private key in localStorage for future use
      localStorage.setItem('privateKey', JSON.stringify(Array.from(privateKey)));
      localStorage.setItem('username', username);
      
      // Redirect to home page
      router.push('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Sovereign Reddit</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Choose a Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}