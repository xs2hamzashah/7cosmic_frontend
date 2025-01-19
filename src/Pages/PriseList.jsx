import { Fragment, useEffect, useState } from "react";
import { Accordion } from "../core/accordion/Accordion";
import Panel from "../Components/price-list/pages/Panel";
import Inverter from "../Components/price-list/pages/Inverter";
import Battery from "../Components/price-list/pages/Battery";
import ElectricWork from "../Components/price-list/pages/Electric";
import MechanicalWork from "../Components/price-list/pages/MechanicalWork";
import CivilWork from "../Components/price-list/pages/CivilWork";
import NetMetering from "../Components/price-list/pages/NetMertering";
import AfterSalesService from "../Components/price-list/pages/AfterSalesService";
import HealthAndSafety from "../Components/price-list/pages/HealthAndSafety";
import DCEarthing from "../Components/price-list/pages/DcEarthing";
import OnlineMonitoring from "../Components/price-list/pages/onlineMonitoring";
import BatteryManagement from "../Components/price-list/pages/BatteryManagement";
import { cn } from "../lib/utils";
import { Loader2 } from "lucide-react";

export function PriceList() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelLoading, setIsPanelLoading] = useState(false);
  const [isInverterLoading, setIsInverterLoading] = useState(false);
  const [isBatteryLoading, setIsBatteryLoading] = useState(false);
  const [isElectricLoading, setIsElectricLoading] = useState(false);
  const [isCivilLoading, setIsCivilLoading] = useState(false);
  const [isMechanicalLoading, setIsMechanicalLoading] = useState(false);
  const [isNetMetLoading, setIsNetMetLoading] = useState(false);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [isOnlineMonitoring, setIsOnlineMonitoring] = useState(false);
  const [isDCEarthingLoading, setIsDCEarthingLoading] = useState(false);
  const [isBmsLoading, setIsBmsLoading] = useState(false);
  const [isAfterSalesLoading, setIsAfterSalesLoading] = useState(false);

  console.log(
    "🚀 ~ PriceList ~ accessToken:",
    localStorage.getItem("accessToken")
  );

  const dependencies = [
    setIsPanelLoading,
    setIsInverterLoading,
    setIsBatteryLoading,
    setIsElectricLoading,
    setIsCivilLoading,
    setIsMechanicalLoading,
    setIsNetMetLoading,
    setIsHealthLoading,
    setIsOnlineMonitoring,
    setIsDCEarthingLoading,
    setIsBmsLoading,
    setIsAfterSalesLoading,
  ];

  useEffect(() => {
    setIsLoading(
      isPanelLoading ||
        isInverterLoading ||
        isBatteryLoading ||
        isElectricLoading ||
        isCivilLoading ||
        isMechanicalLoading ||
        isNetMetLoading ||
        isHealthLoading ||
        isOnlineMonitoring ||
        isDCEarthingLoading ||
        isBmsLoading ||
        isAfterSalesLoading
    );
  }, [...dependencies]);

  return (
    <div className="w-full h-full py-10 mx-auto container ">
      <div className="mb-10">
        <h4 className="text-neutral-900 text-2xl font-semibold">
          Smart Inventory
        </h4>
        <h1 className="text-5xl font-extrabold">Create or Update</h1>
      </div>

      <div>
        <Loader2
          className={cn("animate-spin", {
            hidden: !isLoading,
          })}
          size={50}
        />
      </div>
      <Accordion
        type="single"
        collapsible
        className={cn({
          hidden: isLoading,
        })}
      >
        <Panel setIsLoading={setIsPanelLoading} />
        <Inverter setIsLoading={setIsInverterLoading} />
        <Battery setIsLoading={setIsBatteryLoading} />
        <ElectricWork setIsLoading={setIsElectricLoading} />
        <MechanicalWork setIsLoading={setIsMechanicalLoading} />
        <CivilWork setIsLoading={setIsCivilLoading} />
        <NetMetering setIsLoading={setIsNetMetLoading} />
        <AfterSalesService setIsLoading={setIsAfterSalesLoading} />
        <HealthAndSafety setIsLoading={setIsHealthLoading} />
        <DCEarthing setIsLoading={setIsDCEarthingLoading} />
        <OnlineMonitoring setIsLoading={setIsOnlineMonitoring} />
        <BatteryManagement setIsLoading={setIsBmsLoading} />
      </Accordion>
    </div>
  );
}

export default PriceList;
