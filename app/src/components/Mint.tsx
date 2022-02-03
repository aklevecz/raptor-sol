import { motion } from "framer-motion";
import { TxStates } from "../hooks/useCandyMachine";
import { MetadataDataData } from "@metaplex-foundation/mpl-token-metadata";
import { useEffect, useState } from "react";
import LoadingDots from "./LoadingDots";
type Props = {
  mint: () => void;
  txState: TxStates;
  tokenMeta: MetadataDataData | null;
};

export default function Mint({ mint, txState, tokenMeta }: Props) {
  const [tokenImg, setTokenImg] = useState("");

  useEffect(() => {
    if (tokenMeta && tokenMeta.uri) {
      fetch(tokenMeta.uri)
        .then((r) => r.json())
        .then((data) => {
          setTokenImg(data.image);
        });
    }
  }, [tokenMeta]);
  return (
    <motion.div
      className="step__container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {txState === TxStates.Idle && (
        <>
          <div>Verified!</div>
          <div>It's mint time!</div>
          <button onClick={mint}>Mint</button>
        </>
      )}
      {txState === TxStates.Signing && (
        <>
          <div>Waiting for signature</div>
          <LoadingDots background="yellow" />
        </>
      )}
      {txState === TxStates.Minting && (
        <>
          <div>Minting is progress</div>
          <LoadingDots background="blue" />
        </>
      )}
      {txState === TxStates.Completed && (
        <>
          <div>Success!</div>
          {!tokenMeta && <LoadingDots background="lime" />}
        </>
      )}
      <motion.div layout>
        {tokenMeta && tokenMeta.name && (
          <>
            <div>{tokenMeta.name}</div>
            {tokenImg ? (
              <img
                style={{ width: "100%", height: "auto" }}
                src={tokenImg}
                alt=":("
              />
            ) : (
              <LoadingDots background="white" />
            )}
          </>
        )}{" "}
      </motion.div>
    </motion.div>
  );
}
