import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Image {
    uri: string;
}

interface ImageState {
    step: number;
    images: Image[];
}

const initialState: ImageState[] = [];

const stepImage = createSlice({
    name: 'stepImage',
    initialState,
    reducers: {
        addImage: (state, action: PayloadAction<{ step: number; uri: string }>) => {
            const { step, uri } = action.payload;
            // Find the state for the given step, or create a new one
            let stepState = state.find((item) => item.step === step);
            if (!stepState) {
                stepState = { step, images: [] };
                state.push(stepState);
            }
            // Add the new image URI to the existing step's images array
            stepState.images.push({ uri });
        },
        removeImage: (state, action: PayloadAction<{ step: number; uri: string }>) => {
            const { step, uri } = action.payload;
            // Find the state for the given step
            const stepState = state.find((item) => item.step === step);
            if (stepState) {
                // Filter out the image with the matching URI
                stepState.images = stepState.images.filter((image) => image.uri !== uri);
            }
        },
    },
});

export const { addImage, removeImage } = stepImage.actions;
export default stepImage.reducer;