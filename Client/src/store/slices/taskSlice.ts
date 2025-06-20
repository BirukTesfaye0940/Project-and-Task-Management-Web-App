import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  assignedTo: { _id: string; fullName: string; email: string }[];
  status: 'to-do' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  task: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  task: null,
  loading: false,
  error: null,
};

// --- ASYNC THUNKS ---

export const createTask = createAsyncThunk(
  'task/createTask',
  async (data: Partial<Task>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/task', data);
      return res.data as Task;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Create task failed');
    }
  }
);

export const getTaskById = createAsyncThunk(
  'task/getTaskById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/task/${id}`);
      return res.data as Task;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Get task failed');
    }
  }
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Task> }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/task/${id}`, updates);
      return res.data as Task;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Update task failed');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/task/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Delete task failed');
    }
  }
);

export const assignUsersToTask = createAsyncThunk(
  'task/assignUsersToTask',
  async ({ id, assignedTo }: { id: string; assignedTo: string[] }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/task/${id}/assign`, { assignedTo });
      return res.data as Task;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Assign users failed');
    }
  }
);

// --- SLICE ---

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    resetTaskState: (state) => {
      state.task = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // GET
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state) => {
        state.loading = false;
        state.task = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ASSIGN USERS
      .addCase(assignUsersToTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignUsersToTask.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;
      })
      .addCase(assignUsersToTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetTaskState } = taskSlice.actions;
export default taskSlice.reducer;
