import PhantomIcon from "./PhantomIcon";

type Props = {
  publicKey: string;
  disconnect: () => void;
  remaining: number | undefined;
};

export default function WalletInfo({
  publicKey,
  disconnect,
  remaining,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        left: "5%",
        top: "5%",
        width: "100%",
        zIndex: 2,
        display: publicKey ? "block" : "none",
      }}
    >
      <div
        style={{
          width: "50%",
          textOverflow: "ellipsis",
          fontSize: ".5rem",
        }}
      >
        {publicKey}
      </div>
      <button
        style={{ marginTop: 10 }}
        className="button--small-phantom"
        onClick={disconnect}
      >
        Disconnect <PhantomIcon dims={20} />
      </button>
      <div style={{ fontSize: ".6rem", color: "#cbff00", margin: ".2rem" }}>
        {remaining} NFTs left
      </div>
    </div>
  );
}
