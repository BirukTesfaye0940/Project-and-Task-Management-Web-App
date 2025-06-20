
import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import projectReducer from './slices/projectsSlice'
import inviteReducer from './slices/invitationSlice'
import taksReducer from './slices/taskSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    invite: inviteReducer,
    task: taksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;