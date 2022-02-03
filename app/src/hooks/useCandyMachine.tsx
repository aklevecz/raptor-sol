import * as anchor from "@project-serum/anchor";
import { useEffect, useState } from "react";
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  getCandyMachineState,
  mintOneToken,
} from "../candy-machine";
import {
  Metadata,
  MetadataDataData,
} from "@metaplex-foundation/mpl-token-metadata";

const CANDY_MACHINE_ID = "8Wmxqzvqn1pKpKr1GhbgMV5dcfC1nHgP39MzoYm6eiLc";

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(CANDY_MACHINE_ID);

    return candyMachineId;
  } catch (e) {
    console.log("Failed to construct CandyMachineId", e);
    return undefined;
  }
};

const candyMachineId = getCandyMachineId();
const connection = new anchor.web3.Connection(
  anchor.web3.clusterApiUrl("devnet")
);

const txTimeoutInMilliseconds = 30000;

export enum TxStates {
  Idle,
  Signing,
  Minting,
  Completed,
  Error,
}
export default function useCandyMachine(provider: anchor.Provider | null) {
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount | null>(
    null
  );
  const [tokenMeta, setTokenMeta] = useState<MetadataDataData | null>(null);

  const [txState, setTxState] = useState<TxStates>(TxStates.Idle);
  useEffect(() => {
    if (provider) {
      const wallet = provider.wallet;
      getCandyMachineState(wallet, candyMachineId!, connection).then(
        setCandyMachine
      );
    }
  }, [provider]);

  const mint = async () => {
    if (provider) {
      const wallet = provider.wallet;
      setTxState(TxStates.Signing);
      const { mintTxId, tokenKey } = (
        await mintOneToken(candyMachine!, wallet.publicKey)
      )[0];
      setTxState(TxStates.Minting);
      let status: any = { err: true };
      if (mintTxId) {
        status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          txTimeoutInMilliseconds,
          connection,
          true
        );
      }
      if (status && !status.err) {
        setTxState(TxStates.Completed);
        console.log({
          open: true,
          message: "Congratulations! Mint succeeded!",
          severity: "success",
        });
        let tries = 0;
        const intervalMs = 5000;
        const pollForMeta = async () => {
          const tokenMeta = await Metadata.load(connection, tokenKey).catch(
            () => {
              tries++;
              if (tries < 10) {
                setTimeout(pollForMeta, intervalMs);
              } else {
                console.log("Couldn't find metadata :(");
              }
            }
          );

          if (tokenMeta) {
            setTokenMeta(tokenMeta.data.data);
          }
        };
        pollForMeta();
      } else {
        setTxState(TxStates.Error);
        console.log({
          open: true,
          message: "Mint failed! Please try again!",
          severity: "error",
        });
      }
    }
  };
  return { candyMachine, mint, txState, tokenMeta };
}
