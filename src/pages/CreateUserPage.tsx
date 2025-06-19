import React, { useState } from 'react';
import { createUser, chainHash, getCreateUserTransaction,   submitTransactionToRollup, serializeRuntimeCall } from '../services/sovereign-api';
import { BasicSigner } from '../services/signer';
import {useSolanaWallets, useSignMessage} from '@privy-io/react-auth/solana';
import bs58 from 'bs58';
import { addressFromPublicKey } from '@sovereign-sdk/web3';
const CreateUserPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {wallets} = useSolanaWallets()

  const { signMessage } = useSignMessage()

  console.log("USER WALLETS ARE")
  console.log(wallets)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Convert the private key string to Uint8Array
//          const encoder = new TextEncoder();
//    const address_uin8array = encoder.encode(wallets[0].address);

// ser
//       const signer = await BasicSigner.fromPrivateKeyBytes(address_uin8array, chainHash)
      console.log("WALLET ADDRESS IS")
      console.log(wallets[0].address)



      // console.log("SOV ADDRESS IS")
      // console.log(sov_address)
      const encoded_address = bs58.encode(Uint8Array.from(wallets[0].address))
      console.log("ENCODED ADDRESS IS")
      console.log(encoded_address)
      // console.log("CREATING NEW TOKEN BANK AMOUNT")
      // await createNewUserBankModuleAccount(signer);

      console.log("CREATING NEW USER")
      const user_create_transaction = await getCreateUserTransaction(username);
      // const user_create_transaction_bytes = await serializeRuntimeCall(user_create_transaction);


      // const signature = bs58.encode(user_create_transaction_bytes);

      // // console.log("SIGNED IX IS")
      // //console.log(signedTransaction)


      // console.log("SINATURE IS")
      // console.log(signature)
      const signer = await BasicSigner.fromPrivateKeyBytes(Uint8Array.from(wallets[0].address), chainHash)

        await submitTransactionToRollup(user_create_transaction, signer)
    } catch (err) {
      console.log("SOME ERROR OCCURED FOR SURE")
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Create User</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
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
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage; 