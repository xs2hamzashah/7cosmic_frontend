import { usePanelsQuery } from "../priceList/panel";
import { useAllQuery as useAllInverterQuery } from "../priceList/inverter";
import { useAllQuery as useALlBmsQuery } from "../priceList/bms";
import { useAllQuery as useBatteriesQuery } from "../priceList/battery";
import { useAllQuery as useElectricWorkQuery } from "../priceList/electricWork";
import { useAllQuery as useMechanicalWorkQuery } from "../priceList/mechanicalWork";
import { useAllQuery as useNetMeteringQuery } from "../priceList/netMetering";
import { useAllQuery as useHseEquipmentQuery } from "../priceList/HealthAndSafetyApi";
import { useAllQuery as useDcEarthingQuery } from "../priceList/dcEarthing";
import { useAllQuery as useOnlineMonitoringQuery } from "../priceList/onlineMonitoring";
// import { useAllQuery as useProfitQuery } from "../priceList/profit";
import { useAllQuery as useCommissionQuery } from "../priceList/commission";
import { useAllQuery as useAfterSalesServiceQuery } from "../priceList/afterSalesService";
import { useAllQuery as useCivilWorkQuery } from "../priceList/civilWork";

const usePriceListData = () => {
  const panelsQuery = usePanelsQuery({ id: "" });
  const inverterQuery = useAllInverterQuery({ id: "" });
  const bmsQuery = useALlBmsQuery({ id: "" });
  const batteriesQuery = useBatteriesQuery({ id: "" });
  const electricQuery = useElectricWorkQuery({ id: "" });
  const mechanicalQuery = useMechanicalWorkQuery({ id: "" });
  const netMeteringQuery = useNetMeteringQuery({ id: "" });
  const hseEquipmentQuery = useHseEquipmentQuery({ id: "" });
  const dcEarthingQuery = useDcEarthingQuery({ id: "" });
  const onlineMonitoringQuery = useOnlineMonitoringQuery({ id: "" });

  const commissionQuery = useCommissionQuery({ id: "" });
  const afterSalesServiceQuery = useAfterSalesServiceQuery({ id: "" });
  const civilWorkQuery = useCivilWorkQuery({ id: "" });

  const isLoading =
    panelsQuery.isLoading ||
    inverterQuery.isLoading ||
    bmsQuery.isLoading ||
    batteriesQuery.isLoading ||
    electricQuery.isLoading ||
    mechanicalQuery.isLoading ||
    netMeteringQuery.isLoading ||
    hseEquipmentQuery.isLoading ||
    dcEarthingQuery.isLoading ||
    onlineMonitoringQuery.isLoading ||
    commissionQuery.isLoading ||
    afterSalesServiceQuery.isLoading ||
    civilWorkQuery.isLoading;

  return {
    panelData: panelsQuery.data,
    isPanelLoading: panelsQuery.isLoading,
    inverterData: inverterQuery.data,
    isInverterLoading: inverterQuery.isLoading,
    bmsData: bmsQuery.data,
    isBmsLoading: bmsQuery.isLoading,
    batteryData: batteriesQuery.data,
    electricData: electricQuery.data,
    isElectricLoading: electricQuery.isLoading,
    isMechanicalLoading: mechanicalQuery.isLoading,
    mechanicalData: mechanicalQuery.data,
    netMeteringData: netMeteringQuery.data,
    isNetMeteringLoading: netMeteringQuery.isLoading,
    hseEquipmentData: hseEquipmentQuery.data,
    isHseEquipmentLoading: hseEquipmentQuery.isLoading,
    dcEarthingData: dcEarthingQuery.data,
    isDcEarthingLoading: dcEarthingQuery.isLoading,
    onlineMonitories: onlineMonitoringQuery.data,
    isOnlineMonitoringLoading: onlineMonitoringQuery.isLoading,
    commissionData: commissionQuery.data,
    isCommissionLoading: commissionQuery.isLoading,
    afterSalesServiceData: afterSalesServiceQuery.data,
    isAfterSalesServiceLoading: afterSalesServiceQuery.isLoading,
    civilWorkData: civilWorkQuery.data,
    isCivilWorkLoading: civilWorkQuery.isLoading,
    isLoading,
  };
};

export default usePriceListData;
