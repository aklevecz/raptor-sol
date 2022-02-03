import { useEffect, useState } from "react";
import useWallet from "./hooks/useWallet";
import ConnectWallet from "./components/ConnectWallet";
import Tweet from "./components/Tweet";
import Mint from "./components/Mint";

import { motion, AnimatePresence } from "framer-motion";

import LoadingDots from "./components/LoadingDots";
import useCandyMachine from "./hooks/useCandyMachine";

import "./App.css";
import WalletInfo from "./components/WalletInfo";

enum Steps {
  Connect,
  Tweet,
  Mint,
}

function App() {
  const {
    connect,
    disconnect,
    publicKey,
    provider,
    connectionAttempted,
    hasSolana,
  } = useWallet();
  const { candyMachine, mint, txState, tokenMeta } = useCandyMachine(provider);
  const [step, setStep] = useState(Steps.Connect);
  const nextStep = () => setStep(step + 1);

  useEffect(() => {
    if (step === Steps.Connect && publicKey) {
      setStep(Steps.Tweet);
    }
    if (step > Steps.Connect && !publicKey) {
      setStep(Steps.Connect);
    }
  }, [publicKey, step]);

  if (!connectionAttempted) {
    <div className="App">
      <LoadingDots background="white" />
    </div>;
  }
  if (!hasSolana) {
    return (
      <div className="App">
        <div>I don't see a wallet...</div>
        <a href="https://phantom.app/">get it</a>
      </div>
    );
  }

  return (
    <>
      <WalletInfo
        publicKey={publicKey}
        disconnect={disconnect}
        remaining={candyMachine?.state.itemsRemaining}
      />
      <AnimatePresence initial={true} exitBeforeEnter>
        <motion.div
          className="App"
          key={step}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 1 }}
        >
          {step === Steps.Connect && (
            <ConnectWallet connect={connect} publicKey={publicKey} />
          )}
          {step === Steps.Tweet && (
            <Tweet publicKey={publicKey} nextStep={nextStep} />
          )}
          {step === Steps.Mint && (
            <Mint mint={mint} txState={txState} tokenMeta={tokenMeta} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
