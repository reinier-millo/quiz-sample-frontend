import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface INotification {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

export interface NotificationState {
  isActive: boolean;
  message?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  stack: INotification[];
  ttl: number;
}

/* Notifications initial state */
const initialState: NotificationState = {
  isActive: false,
  stack: [],
  ttl: 5000,
};

/* Declare the notification redux store slice */
export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotification>) => {
      if (!state.isActive) {
        state.message = action.payload.message;
        state.type = action.payload.type;
        state.isActive = true;
      } else {
        state.stack.push(action.payload);
      }
    },
    nextNotification: (state) => {
      if (state.stack.length > 0) {
        state.message = state.stack[0].message;
        state.type = state.stack[0].type;
        state.isActive = true;
      }
    },
    closeNotification: (state) => {
      state.stack = state.stack.slice(1);
      state.isActive = false;
    },
  },
});

/* Export the available store actions */
export const { addNotification, nextNotification, closeNotification } =
  notificationSlice.actions;

/* Declare base selectors */
export const showNotifications = (state: RootState) =>
  state.notifications.isActive;
export const notificationMessage = (state: RootState) =>
  state.notifications.message;
export const notificationType = (state: RootState) => state.notifications.type;

export default notificationSlice.reducer;
