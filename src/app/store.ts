import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../account/store';
import notificationReducer from '../notifications/store';
import quizReducer from '../quiz/store';
import questionReducer from '../question/store';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    quiz: quizReducer,
    question: questionReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
