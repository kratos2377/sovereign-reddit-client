import { PrivyClient } from "@privy-io/server-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Login from "@/components/Login";

export default async function Home() {
  const cookieStore = await cookies()
  const cookieAuthToken = cookieStore.get("privy-token")?.value;


  console.log("Sovereign Reddit COOKIE: " , cookieAuthToken)
  // const {wallets} = useSolanaWallets();
  // // Check that your user is authenticated
  // // Check that your user has an embedded wallet


  // console.log("HAS EMBEDDED WALLET")
  // console.log(wallets)

  if (cookieAuthToken){
    const PRIVY_APP_ID = "cmbxw3sa300msl50mealj8znh";
    const PRIVY_APP_SECRET = "5uc73p6yZ6fuVn6EQUAvVBgbDnYws1XYUAr4trRccVoKSMqNNNNTfkqQBqKPEZcPRauVchgeRPiRUj91siwRJedc";
    const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

    try {
      const claims = await client.verifyAuthToken(cookieAuthToken);
      console.log({ claims });
      //router.replace("/home")
      redirect("/create-user");
    } catch (error) {
      console.error(error);
    }
  }


  return <Login />
}
