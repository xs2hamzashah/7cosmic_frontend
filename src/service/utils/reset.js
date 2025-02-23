import { afterSalesPricingApi } from "../priceList/afterSalesService";
import { batteryPriceService } from "../priceList/battery";
import { panelPriceService } from "../priceList/panel";

import { bmsPriceApiService } from "../priceList/bms";
import { civilWorkPriceService } from "../priceList/civilWork";
import { commissionPriceService } from "../priceList/commission";
import { dcEarthingPriceApi } from "../priceList/dcEarthing";
import { electricWorkPriceService } from "../priceList/electricWork";
import { HealthAndSafetyApi } from "../priceList/HealthAndSafetyApi";
import { inverterPriceService } from "../priceList/inverter";
import { mechanicalWorkPriceService } from "../priceList/mechanicalWork";
import { onlinePricingService } from "../priceList/onlineMonitoring";
import { netMeteringPriceService } from "../priceList/netMetering";

export const resetAPis = () => {
  afterSalesPricingApi.util.resetApiState();
  panelPriceService.util.resetApiState();
  batteryPriceService.util.resetApiState();
  bmsPriceApiService.util.resetApiState();
  civilWorkPriceService.util.resetApiState();
  commissionPriceService.util.resetApiState();
  dcEarthingPriceApi.util.resetApiState();
  electricWorkPriceService.util.resetApiState();
  HealthAndSafetyApi.util.resetApiState();
  HealthAndSafetyApi.util.resetApiState();
  inverterPriceService.util.resetApiState();
  mechanicalWorkPriceService.util.resetApiState();
  netMeteringPriceService.util.resetApiState();
  onlinePricingService.util.resetApiState();
  panelPriceService.util.resetApiState();
};
