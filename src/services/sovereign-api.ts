import { createStandardRollup } from "@sovereign-sdk/web3";
import { type RuntimeCall } from "./types";
import { BasicSigner } from "./signer";
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

// export const createNewUserBankModuleAccount = async (pub) => {

//   console.log("MINT ADDRESS IS")
//   console.log((await signer.publicKey()))
// addressFromPublicKey()
//   const createTokenCall: RuntimeCall = {
//   bank: {
//     create_token: {
//       admins: [
//         (await signer.publicKey()).toString()
//       ],
//       token_decimals: 8,
//       supply_cap: 100000000000,
//       token_name: "sov-reddit-token",
//       initial_balance: 1000000000,
//       mint_to_address: (await signer.publicKey()).toString(),
//     },
//   },
// };


//     await rollup.call(createTokenCall, { signer }); 

// }


export const getCreateUserTransaction = async (username: string) => {
  const create_user_transaction: RuntimeCall = {
    reddit_module: {
      create_user: {
        username: username
      },
    },
  };




  return create_user_transaction;
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

export const submitTransactionToRollup = async ( runtime_call: RuntimeCall , signer: BasicSigner) => {

     await rollup.call(runtime_call, { signer });
 
 }