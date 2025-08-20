import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StepState {
    currentStep: number;
    maxStep: number;
    stepName: string; // Add stepName to the state
}

const initialState: StepState = {
    currentStep: 1,
    maxStep: 4,
    stepName: 'Removal', // Initialize with step 1's name
};

// Step name mapping
const stepNameMapping: { [key: number]: string } = {
    1: 'Removal',
    2: 'Base Care',
    3: 'Design',
    4: 'Final',
};

const stepSlice = createSlice({
    name: 'step',
    initialState,
    reducers: {
        nextStep: (state) => {
            if (state.currentStep < state.maxStep) {
                state.currentStep += 1;
                state.stepName = stepNameMapping[state.currentStep] || `Step ${state.currentStep}`; // Update stepName
            }
        },
        prevStep: (state) => {
            if (state.currentStep > 1) {
                state.currentStep -= 1;
                state.stepName = stepNameMapping[state.currentStep] || `Step ${state.currentStep}`; // Update stepName
            }
        },
        resetStep: (state) => {
            state.currentStep = 1;
            state.stepName = stepNameMapping[1] || 'Step 1'; // Reset to step 1's name
        },
        setStep: (state, action: PayloadAction<number>) => {
            if (action.payload >= 1 && action.payload <= state.maxStep) {
                state.currentStep = action.payload;
                state.stepName = stepNameMapping[state.currentStep] || `Step ${state.currentStep}`; // Update stepName
            }
        },
    },
});

export const { nextStep, prevStep, resetStep, setStep } = stepSlice.actions;
export default stepSlice.reducer;