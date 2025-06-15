 'use client';

import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";

export default function PrivyProvider({ children }: { children: React.ReactNode }) {
    return(
      <BasePrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmbxw3sa300msl50mealj8znh"}
        config={{
            
      
        embeddedWallets: {
            solana: {
                createOnLogin: 'users-without-wallets'
            }
            },
            loginMethods: ['wallet']
        }}
      >
        {children}
      </BasePrivyProvider>
    )
}