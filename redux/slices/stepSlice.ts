import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface StepState {
    currentStep: number
    maxStep: number
}

const initialState: StepState = {
    currentStep: 1,
    maxStep: 4,
}

const stepSlice = createSlice({
    name: 'step',
    initialState,
    reducers: {
        nextStep: (state) => {
            if (state.currentStep < state.maxStep) {
                state.currentStep += 1
            }
        },
        prevStep: (state) => {
            if (state.currentStep > 1) {
                state.currentStep -= 1
            }
        },
        resetStep: (state) => {
            state.currentStep = 1
        },
        setStep: (state, action: PayloadAction<number>) => {
            if (action.payload >= 1 && action.payload <= state.maxStep) {
                state.currentStep = action.payload
            }
        },
    },
})

export const { nextStep, prevStep, resetStep, setStep } = stepSlice.actions
export default stepSlice.reducer
