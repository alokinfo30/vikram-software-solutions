// client/src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  theme: 'light',
  modal: {
    isOpen: false,
    type: null,
    data: null
  },
  notifications: [],
  loading: {
    global: false,
    requests: {}
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null
      };
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      if (key === 'global') {
        state.loading.global = isLoading;
      } else {
        state.loading.requests[key] = isLoading;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const {
  toggleSidebar,
  setTheme,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  setLoading,
  clearNotifications
} = uiSlice.actions;

export default uiSlice.reducer;