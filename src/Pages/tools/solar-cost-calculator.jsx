import { useLocation, useParams, useSearchParams } from "react-router-dom";

export const SolarCostCalculator = () => {
  const params = useParams();
  const accessToken = localStorage.getItem("accessToken");
  const [searchParams, setSearchParams] = useSearchParams();
  const specificParam = searchParams.get("id");

  searchParams.set("access-token", accessToken);
  console.log("🚀 ~ SolarCostCalculator ~ params:", params);

  // const search = searchParams.get("search");
  //   const systemType = searchParams.get("systemType");
  const modifiedUrl = `http://localhost:3000/tools/solar-cost-calculator/${params.id}?${searchParams.toString()}`;

  //   return (
  //     <div>
  //       <p>{JSON.stringify(params.id)}</p>
  //     </div>
  //   );
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

export default SolarCostCalculator;
