export default function LoadingDots({ background = "#000000" }) {
  return (
    <div className="lds-ellipsis">
      <div style={{ background }}></div>
      <div style={{ background }}></div>
      <div style={{ background }}></div>
      <div style={{ background }}></div>
    </div>
  );
}
