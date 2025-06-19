"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useLogin } from "@privy-io/react-auth";
import { apiService } from "../services/api";
import bs58 from "bs58";

export default function Login() {
  const router = useRouter();
  const { wallets } = useSolanaWallets();
  const { login } = useLogin();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [walletChecked, setWalletChecked] = useState(false);

  // Check wallet in DB after Privy login
  const handlePrivyLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(); // Triggers Privy login
      // Wait for wallet to be available
      setTimeout(async () => {
        if (!wallets || wallets.length === 0) {
          setError("Connect your wallet first.");
          setLoading(false);
          return;
        }
        const pubkey = wallets[0].address;
        const bs58Key = bs58.encode(Uint8Array.from(pubkey));
        const user = await apiService.fetchModel({ schema: "user", primaryKey: bs58Key });
        if (user) {
          router.replace("/home");
        } else {
          setShowUsernameForm(true);
        }
        setWalletChecked(true);
        setLoading(false);
      }, 1000); // Wait for wallet to be injected
    } catch (err) {
      setError("Error during login: " + (err instanceof Error ? err.message : "Unknown error"));
      setLoading(false);
    }
  };

  // Handle username registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!wallets || wallets.length === 0) {
        setError("Connect your wallet first.");
        setLoading(false);
        return;
      }
      // Call your createUser logic here (assume createUser exists)
      // await createUser(username, signer);
      // After registration, redirect
      router.push("/home");
    } catch (err) {
      setError("Registration failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen min-w-full">
      {/* Left: SVG and App Title */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-indigo-600 p-8">
        <svg
          className="w-64 h-64 mb-8"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="150" r="120" fill="#fff" fillOpacity="0.15" />
          <circle cx="200" cy="150" r="90" fill="#fff" fillOpacity="0.25" />
          <circle cx="200" cy="150" r="60" fill="#fff" fillOpacity="0.4" />
          <path d="M120 180 Q200 100 280 180" stroke="#fff" strokeWidth="8" fill="none" />
          <circle cx="160" cy="140" r="10" fill="#fff" />
          <circle cx="240" cy="140" r="10" fill="#fff" />
        </svg>
        <h1 className="text-4xl font-bold text-white text-center mb-4">Sovereign Reddit</h1>
        <p className="text-white text-center text-lg">Your decentralized social platform</p>
      </div>
      {/* Right: Login and Username Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {!walletChecked && !showUsernameForm && (
            <div className="flex flex-col items-center">
              <button
                className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg text-lg font-semibold shadow"
                onClick={handlePrivyLogin}
                disabled={loading}
              >
                {loading ? "Checking..." : "Log in with Privy"}
              </button>
              {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
            </div>
          )}
          {showUsernameForm && (
            <form onSubmit={handleRegister} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
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
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}