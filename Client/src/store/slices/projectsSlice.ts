import { axiosInstance } from "@/lib/axios";
import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Types
export interface TeamMember {
  user: string | { _id: string; fullName: string; email: string; profilePic?: string };
  role: "owner" | "admin" | "regular";
  _id: string;
  id?: string;
}

export interface Project {
  _id: string;
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "on-hold";
  team: TeamMember[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tasks?: any[];
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

// API URL
const API_URL = "/project";

// Async Thunks
export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData: Partial<Project>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL, projectData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create project");
    }
  }
);

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch projects");
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${projectId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch project");
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, updates }: { id: string; updates: Partial<Project> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`${API_URL}/${id}`, updates);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update project");
    }
  }
);

export const removeTeamMember = createAsyncThunk(
  "projects/removeMember",
  async ({ id, memberId }: { id: string; memberId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`${API_URL}/${id}/remove-member`, { memberId });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove team member");
    }
  }
);

// Slice
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectState: (state) => {
      state.error = null;
      state.loading = false;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
        state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
        state.currentProject = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects = state.projects.map((proj) =>
          proj._id === action.payload._id ? action.payload : proj
        );
        if (state.currentProject && state.currentProject._id === action.payload._id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(removeTeamMember.fulfilled, (state, action: PayloadAction<{ message: string; team: TeamMember[] }>) => {
        if (state.currentProject) {
          state.currentProject.team = action.payload.team;
        }
      });
  },
});

export const { clearProjectState, setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
