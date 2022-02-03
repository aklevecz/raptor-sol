import { useState } from "react";
import TwitterIcon from "./TwitterIcon";
import { motion } from "framer-motion";
import LoadingDots from "./LoadingDots";

type Props = {
  publicKey: string;
  nextStep: () => void;
};

const serverUrl = "http://localhost:4000";
const findTweetEndpoint = "find-tweet";
const tweetText = "I'm verifying something for someone ";
export default function Tweet({ publicKey, nextStep }: Props) {
  const [isSearching, setIsSearching] = useState(false);
  const [hasTweeted, setHasTweeted] = useState(false);

  const tweet = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText} ${publicKey}`,
      "tweet",
      "left=100,top=100,width=320,height=320,popup"
    );
  };

  const searchForTweet = () => {
    return fetch(`${serverUrl}/${findTweetEndpoint}?address=${publicKey}`)
      .then((r) => r.json())
      .catch((err) => {
        console.log(err);
      });
  };

  if (isSearching) {
    return (
      <div>
        <div>Checking</div> <LoadingDots background="white" />
      </div>
    );
  }
  return (
    <motion.div layout className="step__container">
      <div
        style={{
          opacity: hasTweeted ? 0.6 : 1,
        }}
      >
        <div>Tweet to verify</div>
        <div className="button__wrapper">
          <button
            style={{
              background: "var(--twitter-blue)",
              color: "white",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginTop: 10,
            }}
            onClick={() => {
              setHasTweeted(true);
              tweet();
            }}
          >
            Tweet <TwitterIcon />
          </button>
        </div>
      </div>
      {hasTweeted && (
        <div style={{ fontSize: "1rem" }}>Did you tweet? Press Next!</div>
      )}
      <div className="button__wrapper">
        <button
          disabled={!hasTweeted}
          onClick={async () => {
            setIsSearching(true);
            const resp = await searchForTweet();
            if (resp.success) {
              nextStep();
            }
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
