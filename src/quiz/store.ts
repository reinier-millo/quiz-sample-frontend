import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IQuiz } from './service';

export interface QuizState {
  quizes: IQuiz[];
}

/* Quiz initial state */
const initialState: QuizState = {
  quizes: [],
};

/* Declare the quiz redux store slice */
export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    loadQuizes: (state, action: PayloadAction<IQuiz[]>) => {
      state.quizes = action.payload;
    },
    appendQuiz: (state, action: PayloadAction<IQuiz>) => {
      state.quizes.push(action.payload);
    },
    updateQuiz: (state, action: PayloadAction<IQuiz>) => {
      const idx = state.quizes.findIndex(
        (value: IQuiz) => value.id === action.payload.id
      );
      if (idx >= 0) {
        state.quizes[idx].name = action.payload.name;
        state.quizes[idx].description = action.payload.description;
      }
    },
    deleteQuiz: (state, action: PayloadAction<string>) => {
      const idx = state.quizes.findIndex(
        (value: IQuiz) => value.id === action.payload
      );
      if (idx >= 0) {
        state.quizes.splice(idx, 1);
      }
    },
    clearQuiz: (state) => {
      state.quizes = [];
    },
  },
});

/* Export the available store actions */
export const { loadQuizes, appendQuiz, updateQuiz, deleteQuiz, clearQuiz } =
  quizSlice.actions;

export default quizSlice.reducer;
