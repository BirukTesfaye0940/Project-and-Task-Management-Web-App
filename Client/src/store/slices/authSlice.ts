import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}

interface AuthPayload {
  fullName?: string; // only needed for signup
  email: string;
  password: string;
}

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/check"); // hits the protected route
      return res.data as UserData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Check auth failed");
    }
  }
);

// Thunk for Signup
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData: AuthPayload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/signup", userData);
      return res.data as UserData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

// Thunk for Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: Pick<AuthPayload, "email" | "password">, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", credentials);
      return res.data as UserData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: { profilePic: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      return res.data as UserData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);


const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;