// client/src/store/slices/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/projects');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchAssignedProjects = createAsyncThunk(
  'projects/fetchAssignedProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/projects/assigned');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assigned projects');
    }
  }
);

export const fetchClientProjects = createAsyncThunk(
  'projects/fetchClientProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/projects/my-projects');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch client projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await API.post('/projects', projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'projects/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/projects/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const assignEmployee = createAsyncThunk(
  'projects/assignEmployee',
  async ({ projectId, employeeId }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/projects/${projectId}/assign`, { employeeId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign employee');
    }
  }
);

const initialState = {
  projects: [],
  assignedProjects: [],
  clientProjects: [],
  loading: false,
  error: null,
  selectedProject: null
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Assigned Projects
      .addCase(fetchAssignedProjects.fulfilled, (state, action) => {
        state.assignedProjects = action.payload;
      })
      // Fetch Client Projects
      .addCase(fetchClientProjects.fulfilled, (state, action) => {
        state.clientProjects = action.payload;
      })
      // Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      // Update Project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p._id !== action.payload);
      })
      // Update Project Status
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        const assignedIndex = state.assignedProjects.findIndex(p => p._id === action.payload._id);
        if (assignedIndex !== -1) {
          state.assignedProjects[assignedIndex] = action.payload;
        }
      })
      // Assign Employee
      .addCase(assignEmployee.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      });
  }
});

export const { setSelectedProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;