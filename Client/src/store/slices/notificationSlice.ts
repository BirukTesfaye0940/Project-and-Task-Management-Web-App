import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
//import { Socket } from "socket.io-client";

export interface Notification {
  _id: string;
  message: string;
  task: {
    _id: string;
    title: string;
  };
  recipients: {
    user: string;
    read: boolean;
  }[];
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

// --- Thunks ---

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notifications/${userId}`);
      return response.data as Notification[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addNotification, clearNotifications, clearNotificationError } = notificationSlice.actions;

export default notificationSlice.reducer;
