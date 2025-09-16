import { authApi } from "@/redux/apis/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "./apis/appSlice";
import tasksReducer from "./slices/ClientsRecords";
import stepImageReducer from "./slices/ImagesSlice";
import stepsDataFullReducer from "./slices/StepsDataFinal";
import stepReducer from "./slices/stepSlice";

const store = configureStore({
  reducer: {
    step: stepReducer,
    image: stepImageReducer,
    fullStepData: stepsDataFullReducer,
    clientRecords: tasksReducer,
    [authApi.reducerPath]: authApi.reducer,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(appApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
