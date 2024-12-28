import { Fragment } from "react";
import { Accordion } from "../core/accordion/Accordion";
import Panel from "../Components/price-list/pages/Panel";
import Inverter from "../Components/price-list/pages/Inverter";

export function PriceList() {
  // const data = await getData();

  return (
    <div className="w-full h-full ">
      <div className="mb-10">
        <h4 className="text-neutral-900 text-2xl font-semibold">Price List</h4>
        <h1 className="text-5xl font-extrabold">Create or Update</h1>
      </div>

      <Accordion type="single" collapsible>
        <Panel />
        <Inverter />
        {/* <Battery />
        <ElectricWork />
        <Mechanical />
        <CivilWork />
        <NetMetering />
        <AfterSalesService />
        <HSEEquipment />
        <DCEarthing />
        <OnlineMonitoring />
        <Bms />
        <Profit />
        <Commission /> */}
      </Accordion>
    </div>
  );
}

export default PriceList;
