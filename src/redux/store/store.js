import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
import { batteryPriceService } from "../../service/priceList/battery";
import { electricWorkPriceService } from "../../service/priceList/electricWork";
import { mechanicalWorkPriceService } from "../../service/priceList/mechanicalWork";
import { civilWorkPriceService } from "../../service/priceList/civilWork";
import { netMeteringPriceService } from "../../service/priceList/netMetering";
import { afterSalesPricingApi } from "../../service/priceList/afterSalesService";
import { HealthAndSafetyApi } from "../../service/priceList/HealthAndSafetyApi";
import { dcEarthingPriceApi } from "../../service/priceList/dcEarthing";
import { onlinePricingService } from "../../service/priceList/onlineMonitoring";
import { bmsPriceApiService } from "../../service/priceList/bms";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // this will persist the 'counter' and 'auth' slices of the state
};

const rootReducer = combineReducers({
  [panelPriceService.reducerPath]: panelPriceService.reducer,
  [inverterPriceService.reducerPath]: inverterPriceService.reducer,
  [batteryPriceService.reducerPath]: batteryPriceService.reducer,
  [electricWorkPriceService.reducerPath]: electricWorkPriceService.reducer,
  [mechanicalWorkPriceService.reducerPath]: mechanicalWorkPriceService.reducer,
  [civilWorkPriceService.reducerPath]: civilWorkPriceService.reducer,
  [netMeteringPriceService.reducerPath]: netMeteringPriceService.reducer,
  [afterSalesPricingApi.reducerPath]: afterSalesPricingApi.reducer,
  [HealthAndSafetyApi.reducerPath]: HealthAndSafetyApi.reducer,
  [dcEarthingPriceApi.reducerPath]: dcEarthingPriceApi.reducer,
  [onlinePricingService.reducerPath]: onlinePricingService.reducer,
  [bmsPriceApiService.reducerPath]: bmsPriceApiService.reducer,

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
      batteryPriceService.middleware,
      electricWorkPriceService.middleware,
      mechanicalWorkPriceService.middleware,
      civilWorkPriceService.middleware,
      netMeteringPriceService.middleware,
      afterSalesPricingApi.middleware,
      HealthAndSafetyApi.middleware,
      dcEarthingPriceApi.middleware,
      onlinePricingService.middleware,
      bmsPriceApiService.middleware,
      // profitPriceService.middleware,
      // commissionPriceService.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});

export const persister = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
