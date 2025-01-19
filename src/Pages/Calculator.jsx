export const Calculator = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        // backgroundColor: "red",
      }}
    >
      <iframe
        width="100%"
        height="100%"
        style={{ border: "none" }}
        src={URL}
      ></iframe>
    </div>
  );
};

const URL =
  "https://7-solar-calculators-production.up.railway.app/tools/solar-cost-calculator";
