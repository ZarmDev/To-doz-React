import { configureStore, createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    sidebarIsAlwaysOpen: localStorage.getItem('sidebarIsAlwaysOpen') === 'true',
  },
  reducers: {
    toggleSidebar: (state, action) => {
      state.sidebarIsAlwaysOpen = action.payload;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
  },
});

export default store;