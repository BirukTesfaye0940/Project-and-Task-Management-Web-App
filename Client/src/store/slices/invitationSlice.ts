// store/slices/invitationSlice.ts
import { createSlice, createAsyncThunk,  } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';

const API_URL = 'http://localhost:5003/api/invite';

interface InvitationState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
}

const initialState: InvitationState = {
  loading: false,
  success: false,
  error: null,
  message: null,
};

// Async thunk to send an invitation
export const sendInvitation = createAsyncThunk(
  'invitation/send',
  async (
    data: { email: string; role: 'owner' | 'admin' | 'regular'; projectId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}`,
        data,
        { withCredentials: true } // To send cookies (auth token)
      );
      return response.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send invitation');
    }
  }
);

const invitationSlice = createSlice({
  name: 'invite',
  initialState,
  reducers: {
    resetInvitationState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendInvitation.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = null;
      })
      .addCase(sendInvitation.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload;
      })
      .addCase(sendInvitation.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetInvitationState } = invitationSlice.actions;
export default invitationSlice.reducer;
