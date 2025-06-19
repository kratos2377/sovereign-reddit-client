import * as ed25519 from "@noble/ed25519";
 import { Signer } from "@sovereign-sdk/signers";
 import bs58 from "bs58";

 
 export class BasicSigner implements Signer {
   private privateKey: string;
   private chainHash: Uint8Array;
   constructor(privateKey: string, chainHash: Uint8Array) {
     this.privateKey = privateKey;
     this.chainHash = chainHash;
   }

   public async sign(message: Uint8Array): Promise<Uint8Array> {
     const chain_hash = this.chainHash;
     return ed25519.signAsync(
       new Uint8Array([...message, ...chain_hash]),
       this.privateKey
     );
   }

   async publicKey() {
     return ed25519.getPublicKeyAsync(this.privateKey);
   }

   async getBs58Key() {
    return bs58.encode( await this.publicKey() );
   }

   // Constructs a BasicSigner from a private key and a chain hash
   static async fromPrivateKeyBytes(
     privateKeyBytes: Uint8Array,
     chainHash: Uint8Array
   ): Promise<BasicSigner> {
     const privateKey = ed25519.etc
       .bytesToHex(privateKeyBytes.slice(0, 32))
       .replace(/^0x/, "");
     // Get the public key to ensure the private key is valid
     const publicKeyBytes = await ed25519.getPublicKeyAsync(privateKey);
     const _publicKey = ed25519.etc
       .bytesToHex(publicKeyBytes)
       .replace(/^0x/, "");
     return new BasicSigner(privateKey, chainHash);
   }
 }
