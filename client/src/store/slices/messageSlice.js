// client/src/store/slices/messageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/messages/conversations');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/messages/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ receiverId, content }, { rejectWithValue }) => {
    try {
      const response = await API.post('/messages', { receiverId, content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await API.put(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

const initialState = {
  conversations: [],
  currentMessages: [],
  users: [],
  loading: false,
  error: null,
  selectedUser: null
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    addMessage: (state, action) => {
      state.currentMessages.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.currentMessages = action.payload;
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.currentMessages.push(action.payload);
      })
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.currentMessages.findIndex(m => m._id === action.payload._id);
        if (index !== -1) {
          state.currentMessages[index] = action.payload;
        }
      });
  }
});

export const { setSelectedUser, addMessage, clearError } = messageSlice.actions;
export default messageSlice.reducer;