"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy, useSolanaWallets, useLogin } from "@privy-io/react-auth";
import { apiService } from "@/services/api";
import { BasicSigner } from "@/services/signer";
import { chainHash, getCreateUserTransaction, submitTransactionToRollup } from "@/services/sovereign-api";
import { useStore } from "@/store/useStore";
import { LoadingModal } from "@/components/LoadingModal";


export default function Home() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const [loading, setLoading] = useState(true);
  const { ready, authenticated } = usePrivy();


  const { wallets , ready: walletReady } = useSolanaWallets();
  const { login } = useLogin({
    
      onComplete: () => {
        checkUserAccount().then(() => {
          setLoading(false);
         })
      }
    
  });
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [walletChecked, setWalletChecked] = useState(false);
  const [verifyingUser, setVerifyingUser] = useState(false);
  const [verifyingMessage, setVerifyingMessage] = useState("");


  useEffect(() => {
    const checkClaims = async () => {
      setLoading(true);
      if (!ready || !walletReady) return;
      


      if (authenticated) {      
          try {
            // const claims = await client.verifyAuthToken(cookieAuthToken);
            // console.log({ claims });
            //router.replace("/home")
           // redirect("/home");
           checkUserAccount().then(() => {
            setLoading(false);
           })
          } catch (error) {
            console.error(error);

            setLoading(false);
          }
        
      


      } else {
        setLoading(false);
      } 

    };
    checkClaims();
  }, [ready, authenticated, router , walletReady]);

  const checkUserAccount = async () => {


   try {
    setTimeout(async () => {
      if (!wallets || wallets.length === 0) {
        setError("Connect your wallet first.");
        setLoading(false)
        return;
      }


      const signer = await BasicSigner.fromPrivateKeyBytes(Uint8Array.from(wallets[0].address) , chainHash)

      const bs58Key = await signer.getBs58Key()
      const user = await apiService.fetchModel({ schema: "user", primaryKey: bs58Key });
     


      if (user.data.models !== null && user.data.models !== undefined  && user.data.models.length > 0) {
        setUser({
          sov_id: user.data.models[0].sov_id,
          username: user.data.models[0].username
        });

        setTimeout(() => {
          router.replace("/home");
        } , 200)
      } else {
        setShowUsernameForm(true);
        setUser(null);
      }
      setWalletChecked(true);
    }, 2000); //
   } catch (err) {
    setLoading(false);
   }

}

    // Check wallet in DB after Privy login
    const handlePrivyLogin = async () => {
      setError(null);
      try {
        // Triggers Privy login
        // Wait for wallet to be available
        setTimeout(async () => {
          if (!wallets || wallets.length === 0) {
            setError("Connect your wallet first.");
            setLoading(false)
            return;
                   }

                   await login();
        }, 2000); // wallet to be injected
      } catch (err) {
        setError("Error during login: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    };
  
    // Handle username registration
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      try {
        if (!wallets || wallets.length === 0) {
          setError("Connect your wallet first.");
          return;
        }
        if (username.length < 5) {
          setError("Username must be at least 5 characters long.");
          return;
        }

        const signer = await BasicSigner.fromPrivateKeyBytes(Uint8Array.from(wallets[0].address) , chainHash)
        const user_create_transaction = await getCreateUserTransaction(username);
  
        await submitTransactionToRollup(user_create_transaction, signer)
        setVerifyingUser(true);
        setVerifyingMessage("Transaction Submitted. Verifying User...");
        // Try to fetch user up to 3 times, increasing wait by 5s each time
        let found = false;
        let attempt = 0;
        let wait = 5000;
        const bs58Key = await signer.getBs58Key();
        while (attempt < 3 && !found) {
          await new Promise((res) => setTimeout(res, wait));
          try {
            const user = await apiService.fetchModel({ schema: "user", primaryKey: bs58Key });
            if (user.data.models && user.data.models.length > 0) {
              setUser({
                sov_id: user.data.models[0].sov_id,
                username: user.data.models[0].username
              });
              setTimeout(() => {
                setVerifyingUser(false);
                router.replace("/home");
              }, 200);
              found = true;
              break;
            }
          } catch (err) {
            // ignore, will retry
          }
          attempt++;
          wait += 5000;
        }
        if (!found) {
          setVerifyingUser(false);
          setError("Registration succeeded but user not found after transaction. Please refresh or try again.");
        } else {
          setVerifyingUser(false);
          router.replace("/home");
        }
      } catch (err) {
        setVerifyingUser(false);
        setError("Registration failed: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    };
  

  return  (
    <main className="flex flex-rowmin-h-screen min-w-full">
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
          {loading ? (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-indigo-600 animate-pulse w-3/4 transition-all duration-700"></div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}
