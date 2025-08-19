import { configureStore } from "@reduxjs/toolkit"
import stepImageReducer from "./slices/ImagesSlice"
import stepsDataFullReducer from "./slices/StepsDataFinal"
import stepReducer from './slices/stepSlice'
const store = configureStore({
    reducer: {
        step: stepReducer,
        image: stepImageReducer,
        fullStepData: stepsDataFullReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store