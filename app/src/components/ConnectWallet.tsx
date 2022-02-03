import { useState } from "react";
import { motion } from "framer-motion";
import LoadingDots from "./LoadingDots";
import PhantomIcon from "./PhantomIcon";

type Props = {
  connect: () => void;
  publicKey: string;
};

export default function ConnectWallet({ connect }: Props) {
  const [isConnecting, setIsConnecting] = useState(false);
  return (
    <div className="step__container">
      <div>Time to connect your wallet</div>
      <div className="button__wrapper">
        <motion.button
          layout
          style={{
            background: "#5343B9",
            color: "white",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          onClick={() => {
            connect();
            setIsConnecting(true);
          }}
        >
          {isConnecting ? (
            <LoadingDots background="#FFFFFF" />
          ) : (
            <>
              Connect
              <PhantomIcon />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
