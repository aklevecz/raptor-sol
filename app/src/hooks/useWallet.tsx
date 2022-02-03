import { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection } from "@solana/web3.js";

declare global {
  interface Window {
    solana: any;
  }
}

const useWallet = () => {
  const [hasSolana, setHasSolana] = useState(false);
  const [provider, setProvider] = useState<anchor.Provider | null>(null);
  const [publicKey, setPublicKey] = useState("");
  const [connectionAttempted, setConnectionAttempted] = useState(false);

  const getProvider = () => {
    if ("solana" in window) {
      const wallet = window.solana;
      const network = clusterApiUrl("devnet");
      const connection = new Connection(network);
      const provider = new anchor.Provider(connection, wallet, {
        commitment: "processed",
      });
      return provider;
    }
  };

  useEffect(() => {
    if ("solana" in window) {
      setHasSolana(true);
      window.solana
        .connect({ onlyIfTrusted: true })
        .then(({ publicKey }: { publicKey: string }) => {
          setPublicKey(publicKey.toString());
          const provider = getProvider();
          provider && setProvider(provider);
          setConnectionAttempted(true);
        })
        .catch((err: any) => {
          console.log(err);
          setConnectionAttempted(true);
        });
      window.solana.on("disconnect", () => {
        setProvider(null);
        setPublicKey("");
      });
    } else {
      setConnectionAttempted(true);
      setHasSolana(false);
    }
  }, []);

  const connect = async () => {
    try {
      const resp = await window.solana.connect();
      setPublicKey(resp.publicKey.toString());
      const provider = getProvider();
      provider && setProvider(provider);
    } catch (err) {
      window.open("https://phantom.app/", "_blank");

      console.log(err);
    }
  };

  const disconnect = () => {
    try {
      window.solana.disconnect();
    } catch (err) {
      console.log(err);
    }
  };

  return {
    connect,
    disconnect,
    publicKey,
    provider,
    connectionAttempted,
    hasSolana,
  };
};

export default useWallet;
