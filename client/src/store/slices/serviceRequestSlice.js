// client/src/store/slices/serviceRequestSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchServiceRequests = createAsyncThunk(
  'serviceRequests/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/service-requests');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
    }
  }
);

export const fetchMyRequests = createAsyncThunk(
  'serviceRequests/fetchMyRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/service-requests/my-requests');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your requests');
    }
  }
);

export const createServiceRequest = createAsyncThunk(
  'serviceRequests/create',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await API.post('/service-requests', requestData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create request');
    }
  }
);

export const approveRequest = createAsyncThunk(
  'serviceRequests/approve',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await API.put(`/service-requests/${requestId}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve request');
    }
  }
);

export const rejectRequest = createAsyncThunk(
  'serviceRequests/reject',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await API.put(`/service-requests/${requestId}/reject`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject request');
    }
  }
);

const initialState = {
  requests: [],
  myRequests: [],
  loading: false,
  error: null
};

const serviceRequestSlice = createSlice({
  name: 'serviceRequests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Requests
      .addCase(fetchServiceRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchServiceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Requests
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.myRequests = action.payload;
      })
      // Create Request
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.myRequests.push(action.payload);
        state.requests.push(action.payload);
      })
      // Approve Request
      .addCase(approveRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      // Reject Request
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      });
  }
});

export const { clearError } = serviceRequestSlice.actions;
export default serviceRequestSlice.reducer;