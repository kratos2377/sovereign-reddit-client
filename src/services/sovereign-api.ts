import { createStandardRollup } from "@sovereign-sdk/web3";
import { type RuntimeCall } from "./types";
import { BasicSigner } from "./signer";
import { Wallet } from "@privy-io/react-auth";

const rollup = await createStandardRollup({
  context: {
    defaultTxDetails: {
      max_priority_fee_bips: 0,
      max_fee: "100000000",
      gas_limit: null,
      chain_id: 4321, // Note: Must match the chain id in constants.toml
    },
  },
});

export const chainHash = rollup.serializer.schema.chainHash;



export const createUser = async (username: string , signer: BasicSigner) => {
 const create_user_transaction: RuntimeCall = {
  reddit_module: {
    create_user: {
      username: username
    },
  },
};



    await rollup.call(create_user_transaction, { signer }); 

}