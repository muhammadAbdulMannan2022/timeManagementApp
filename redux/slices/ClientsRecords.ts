// store/slices/tasksSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Task {
    id: number
    name: string
    targetTime: string
    takenTime: string
    date: string // YYYY-M-D
    photo: string[]
}

interface TasksState {
    tasks: Task[]
}

const initialState: TasksState = {
    tasks: [
        {
            id: 1,
            name: "Task One",
            targetTime: "02:00:00",
            takenTime: "01:45:20",
            date: "2025-08-22",
            photo: ["photo1.png", "photo2.png"],
        },
        {
            id: 2,
            name: "Task Two",
            targetTime: "01:30:00",
            takenTime: "01:20:10",
            date: "2025-08-22",
            photo: [],
        },
        {
            id: 3,
            name: "Task Three",
            targetTime: "00:45:00",
            takenTime: "00:40:30",
            date: "2025-08-21",
            photo: ["img1.jpg"],
        },
    ],
}

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload)
        },
    },
})

export const { addTask } = tasksSlice.actions
export default tasksSlice.reducer
