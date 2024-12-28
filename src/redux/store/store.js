// import { afterSalesServicePriceService } from "@/service/priceList/afterSalesService";
// import { batteryPriceService } from "@/service/priceList/battery";
// import { bmsServicePriceService } from "@/service/priceList/bms";
// import { civilWorkPriceService } from "@/service/priceList/civilWork";
// import { commissionPriceService } from "@/service/priceList/commission";
// import { dcEarthingServicePriceService } from "@/service/priceList/dcEarthing";
// import { electricWorkPriceService } from "@/service/priceList/electricWork";
// import { hseEquipmentServicePriceService } from "@/service/priceList/hseEquipment";
// import { inverterPriceService } from "@/service/priceList/inverter";
// import { mechanicalWorkPriceService } from "@/service/priceList/mechanicalWork";
// import { netMeteringPriceService } from "@/service/priceList/netMetering";
// import { onlineMonitoringServicePriceService } from "@/service/priceList/onlineMonitoring";
// import { panelPriceService } from "@/service/priceList/panel";
// import { profitPriceService } from "@/service/priceList/profit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// Slices

// redux-persist
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import { panelPriceService } from "../../service/priceList/panel";
import { inverterPriceService } from "../../service/priceList/inverter";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // this will persist the 'counter' and 'auth' slices of the state
};

const rootReducer = combineReducers({
  [panelPriceService.reducerPath]: panelPriceService.reducer,
  [inverterPriceService.reducerPath]: inverterPriceService.reducer,
  // [batteryPriceService.reducerPath]: batteryPriceService.reducer,
  // [electricWorkPriceService.reducerPath]: electricWorkPriceService.reducer,
  // [mechanicalWorkPriceService.reducerPath]: mechanicalWorkPriceService.reducer,
  // [civilWorkPriceService.reducerPath]: civilWorkPriceService.reducer,
  // [netMeteringPriceService.reducerPath]: netMeteringPriceService.reducer,
  // [afterSalesServicePriceService.reducerPath]: afterSalesServicePriceService.reducer,
  // [hseEquipmentServicePriceService.reducerPath]: hseEquipmentServicePriceService.reducer,
  // [dcEarthingServicePriceService.reducerPath]: dcEarthingServicePriceService.reducer,
  // [onlineMonitoringServicePriceService.reducerPath]: onlineMonitoringServicePriceService.reducer,
  // [bmsServicePriceService.reducerPath]: bmsServicePriceService.reducer,
  // [profitPriceService.reducerPath]: profitPriceService.reducer,
  // [commissionPriceService.reducerPath]: commissionPriceService.reducer,

  // app: appSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      panelPriceService.middleware,
      inverterPriceService.middleware,
      //   batteryPriceService.middleware,
      //   electricWorkPriceService.middleware,
      //   mechanicalWorkPriceService.middleware,
      //   civilWorkPriceService.middleware,
      //   netMeteringPriceService.middleware,
      //   afterSalesServicePriceService.middleware,
      //   hseEquipmentServicePriceService.middleware,
      //   dcEarthingServicePriceService.middleware,
      //   onlineMonitoringServicePriceService.middleware,
      //   bmsServicePriceService.middleware,
      //   profitPriceService.middleware,
      //   commissionPriceService.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});

export const persister = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
