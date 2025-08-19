import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Image {
    uri: string;
}

interface StepStateDataFull {
    stepNumber: number;
    stepName: string;
    stepImages?: Image[];
    takenTime: string | number;
    tergetTime: string | number;
    stepNote: string;
}

const initialState: StepStateDataFull[] = [];

const stepsDataFull = createSlice({
    name: "fullStepData",
    initialState,
    reducers: {
        updateStepName: (
            state,
            action: PayloadAction<{ stepNumber: number; stepName: string }>
        ) => {
            const step = state.find((item) => item.stepNumber === action.payload.stepNumber);
            if (step) {
                step.stepName = action.payload.stepName;
            }
        },
        updateStepImages: (
            state,
            action: PayloadAction<{ stepNumber: number; stepImages: Image[] }>
        ) => {
            const step = state.find((item) => item.stepNumber === action.payload.stepNumber);
            if (step) {
                step.stepImages = action.payload.stepImages;
            }
        },
        updateTakenTime: (
            state,
            action: PayloadAction<{ stepNumber: number; takenTime: string | number }>
        ) => {
            const step = state.find((item) => item.stepNumber === action.payload.stepNumber);
            if (step) {
                step.takenTime = action.payload.takenTime;
            }
        },
        updateTergetTime: (
            state,
            action: PayloadAction<{ stepNumber: number; tergetTime: string | number }>
        ) => {
            const step = state.find((item) => item.stepNumber === action.payload.stepNumber);
            if (step) {
                step.tergetTime = action.payload.tergetTime;
            }
        },
        updateStepNote: (
            state,
            action: PayloadAction<{ stepNumber: number; stepNote: string }>
        ) => {
            const step = state.find((item) => item.stepNumber === action.payload.stepNumber);
            if (step) {
                step.stepNote = action.payload.stepNote;
            }
        },
        addStep: (state, action: PayloadAction<StepStateDataFull>) => {
            const existingStep = state.find((item) => item.stepNumber === action.payload.stepNumber);
            if (!existingStep) {
                state.push(action.payload);
            }
        },
    },
});

export const { updateStepName, updateStepImages, updateTakenTime, updateTergetTime, updateStepNote, addStep } = stepsDataFull.actions;
export default stepsDataFull.reducer;