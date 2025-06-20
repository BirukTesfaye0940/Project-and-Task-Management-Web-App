import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

export interface Issue {
  _id: string;
  description: string;
  project: {
    _id: string;
    name: string;
  };
  reportedBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  status: "open" | "in-progress" | "resolved";
  resolution: string;
  createdAt: string;
  updatedAt: string;
}

interface IssuesState {
  issues: Issue[];
  currentIssue: Issue | null;
  loading: boolean;
  error: string | null;
}

const initialState: IssuesState = {
  issues: [],
  currentIssue: null,
  loading: false,
  error: null,
};

// --- Thunks ---

// Fetch issues for a specific project
export const fetchIssues = createAsyncThunk(
  "issues/fetchIssues",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/issues?projectId=${projectId}`);
      return response.data as Issue[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch issues");
    }
  }
);

// Get a single issue
export const fetchIssueById = createAsyncThunk(
  "issues/fetchIssueById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/issues/${id}`);
      return response.data as Issue;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch issue");
    }
  }
);

// Create a new issue
export const createIssue = createAsyncThunk(
  "issues/createIssue",
  async (
    payload: { description: string; project: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(`/issues`, payload);
      return response.data as Issue;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create issue");
    }
  }
);

// Update an issue
export const updateIssue = createAsyncThunk(
  "issues/updateIssue",
  async (
    { id, data }: { id: string; data: Partial<Omit<Issue, "_id" | "reportedBy" | "project" | "createdAt" | "updatedAt">> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/issues/${id}`, data);
      return response.data as Issue;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update issue");
    }
  }
);

// Delete an issue
export const deleteIssue = createAsyncThunk(
  "issues/deleteIssue",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/issues/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete issue");
    }
  }
);

// --- Slice ---
const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    clearCurrentIssue: (state) => {
      state.currentIssue = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch issues
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single issue
      .addCase(fetchIssueById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIssue = action.payload;
      })
      .addCase(fetchIssueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create issue
      .addCase(createIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues.push(action.payload);
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update issue
      .addCase(updateIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = state.issues.map((issue) =>
          issue._id === action.payload._id ? action.payload : issue
        );
        if (state.currentIssue && state.currentIssue._id === action.payload._id) {
          state.currentIssue = action.payload;
        }
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete issue
      .addCase(deleteIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = state.issues.filter((issue) => issue._id !== action.payload);
        if (state.currentIssue && state.currentIssue._id === action.payload) {
          state.currentIssue = null;
        }
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentIssue, clearError } = issuesSlice.actions;

export default issuesSlice.reducer;
