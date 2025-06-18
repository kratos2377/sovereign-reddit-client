import { addressFromPublicKey, createStandardRollup } from "@sovereign-sdk/web3";
import { type RuntimeCall } from "./types";
import { BasicSigner } from "./signer";
import * as ed25519 from "@noble/ed25519";
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

export const createNewUserBankModuleAccount = async (signer: BasicSigner) => {


  const signer_pub_address = ed25519.etc.bytesToHex(await signer.publicKey()).replace(/^0x/, "");


  const createTokenCall: RuntimeCall = {
  bank: {
    mint: {
      coins: {
        amount: 1000000,
        token_id: "token_1nyl0e0yweragfsatygt24zmd8jrr2vqtvdfptzjhxkguz2xxx3vs0y07u7"
      },
      mint_to_address: addressFromPublicKey(signer_pub_address , "sov")
    },
  },
};


    await rollup.call(createTokenCall, { signer }); 

}

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