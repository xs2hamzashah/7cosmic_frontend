import { useEffect, useState } from "react";

export const Calculator = () => {
  const [token, setToken] = useState("");
  console.log("🚀 ~ Calculator ~ token:", token);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setToken(token);
    }
  }, []);

  if (!token) {
    return <div>Loading...</div>;
  }

  const modifiedUrl = `http://localhost:3000/tools/solar-cost-calculator?access-token=${token}`;

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
        src={modifiedUrl}
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
};
