// store/slices/processesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Step interface ---
export interface Step {
    id: number;
    name: string;
    targetTime: string;
    takenTime: string;
    date: string; // date of this step
    photo: string[];
    note?: string; // optional note for the step
    iconName?: string;
    iconColor?: string;
    iconType?: "FontAwesome" | "MaterialIcons" | "Ionicons" | "FontAwesome6" | "FontAwesome5";
}

// --- Process interface ---
export interface Process {
    id: number;
    name: string;
    date: string; // date of the process itself
    steps: Step[];
}

// --- State interface ---
interface ProcessesState {
    processes: Process[];
}

// --- Initial state ---
const initialState: ProcessesState = {
    processes: [
        {
            id: 1,
            name: "Process One",
            date: "2025-08-22",
            steps: [
                {
                    id: 1,
                    name: "Task One",
                    targetTime: "02:00:00",
                    takenTime: "01:45:20",
                    date: "2025-08-22",
                    photo: ["photo1.png", "photo2.png"],
                    note: "This step is high priority",
                    iconName: "hand",
                    iconColor: "#00B8D4",
                    iconType: "FontAwesome6",
                },
                {
                    id: 2,
                    name: "Task Two",
                    targetTime: "01:30:00",
                    takenTime: "01:20:10",
                    date: "2025-08-23",
                    photo: ["photo2.png"],
                    note: "Check this carefully",
                    iconName: "heart-o",
                    iconColor: "#00B8D4",
                    iconType: "FontAwesome",
                },
                {
                    id: 3,
                    name: "Task Three",
                    targetTime: "01:30:00",
                    takenTime: "01:40:10",
                    date: "2025-08-23",
                    photo: ["photo2.png"],
                    note: "Check this carefully",
                    iconName: "draw",
                    iconColor: "#00B8D4",
                    iconType: "MaterialIcons",
                },
            ],
        },
        {
            id: 2,
            name: "Process Two",
            date: "2025-08-21",
            steps: [
                {
                    id: 1,
                    name: "Task Three",
                    targetTime: "00:45:00",
                    takenTime: "00:40:30",
                    date: "2025-08-21",
                    photo: ["img1.jpg"],
                    note: "Optional note for this step",
                    iconName: "draw",
                    iconColor: "#00B8D4",
                    iconType: "MaterialIcons",
                },
            ],
        },
    ],
};

// --- Slice ---
const processesSlice = createSlice({
    name: "processes",
    initialState,
    reducers: {
        addProcess: (state, action: PayloadAction<Process>) => {
            state.processes.push(action.payload);
        },
        updateProcess: (state, action: PayloadAction<{ id: number; data: Partial<Process> }>) => {
            const index = state.processes.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.processes[index] = { ...state.processes[index], ...action.payload.data };
            }
        },
        addStepToProcess: (state, action: PayloadAction<{ processId: number; step: Step }>) => {
            const process = state.processes.find(p => p.id === action.payload.processId);
            if (process) process.steps.push(action.payload.step);
        },
        updateStepInProcess: (
            state,
            action: PayloadAction<{ processId: number; stepId: number; data: Partial<Step> }>
        ) => {
            const process = state.processes.find(p => p.id === action.payload.processId);
            if (process) {
                const stepIndex = process.steps.findIndex(s => s.id === action.payload.stepId);
                if (stepIndex !== -1) {
                    process.steps[stepIndex] = { ...process.steps[stepIndex], ...action.payload.data };
                }
            }
        },
        removeStepFromProcess: (state, action: PayloadAction<{ processId: number; stepId: number }>) => {
            const process = state.processes.find(p => p.id === action.payload.processId);
            if (process) {
                process.steps = process.steps.filter(s => s.id !== action.payload.stepId);
            }
        },
        removeProcess: (state, action: PayloadAction<number>) => {
            state.processes = state.processes.filter(p => p.id !== action.payload);
        },
    },
});

export const {
    addProcess,
    updateProcess,
    addStepToProcess,
    updateStepInProcess,
    removeStepFromProcess,
    removeProcess,
} = processesSlice.actions;

export default processesSlice.reducer;
