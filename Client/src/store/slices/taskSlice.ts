import { createSlice, createAsyncThunk,  } from '@reduxjs/toolkit'; // Added PayloadAction
import type {PayloadAction} from '@reduxjs/toolkit'
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
  tasks: Task[];
  task: Task | null; // This is for a single selected task, e.g., for a detail view or edit form
  loading: boolean;
  error: string | null;
  filters: {
    status: 'all' | 'to-do' | 'in-progress' | 'done';
    priority: 'all' | 'low' | 'medium' | 'high';
  };
}

const initialState: TaskState = {
  tasks: [],
  task: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
  }
};


// --- ASYNC THUNKS ---

export const createTask = createAsyncThunk(
  'task/createTask',
  async (data: Partial<Task>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/tasks', data);
      return res.data as Task;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Create task failed');
    }
  }
);

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async () => { // Added projectId as an optional parameter
    try {
      const url = '/tasks'; // Fetch by project if projectId is provided
      const res = await axiosInstance.get(url);
      return res.data as Task[];
    } catch (err: any) {
      return (err?.response?.data?.message || 'Fetch tasks failed');
    }
  }
);


export const getTaskById = createAsyncThunk(
  'task/getTaskById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/tasks/${id}`);
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
      const res = await axiosInstance.patch(`/tasks/${id}`, updates);
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
      await axiosInstance.delete(`/tasks/${id}`);
      return id; // Return the ID of the deleted task for filtering
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Delete task failed');
    }
  }
);

export const assignUsersToTask = createAsyncThunk(
  'task/assignUsersToTask',
  async ({ id, assignedTo }: { id: string; assignedTo: string[] }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/tasks/${id}/assign`, { assignedTo });
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
      state.tasks = []; // Reset tasks array when resetting state
      state.task = null;
      state.loading = false;
      state.error = null;
      state.filters = { status: 'all', priority: 'all' }; // Also reset filters
    },
    setStatusFilter: (state, action: PayloadAction<TaskState['filters']['status']>) => {
      state.filters.status = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<TaskState['filters']['priority']>) => {
      state.filters.priority = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { status: 'all', priority: 'all' };
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH TASKS
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE TASK
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.task = action.payload; // Set the single task, if this is needed for, e.g., a form
        state.tasks.push(action.payload); // Add to the list
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // GET TASK BY ID
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.task = action.payload; // Set the single task in the state
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE TASK
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.task = action.payload; // Update the single task state
        // Update the task in the tasks array
        state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE TASK
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(t => t._id !== action.payload); // Filter out the deleted task
        if (state.task && state.task._id === action.payload) { // If the deleted task was the currently selected one
          state.task = null; // Clear the single task state
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ASSIGN USERS TO TASK
      .addCase(assignUsersToTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignUsersToTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.task = action.payload; // Update the single task if it's the one being assigned
        // Also update the task in the main list
        state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t);
      })
      .addCase(assignUsersToTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetTaskState, setStatusFilter, setPriorityFilter, resetFilters } = taskSlice.actions;
export default taskSlice.reducer;