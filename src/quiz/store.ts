import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IQuiz, IQuizEvaluation } from './service';

export interface QuizState {
  quizes: IQuiz[];
  responses: any;
}

/* Quiz initial state */
const initialState: QuizState = {
  quizes: [],
  responses: {},
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
    registerResponse: (state, action: PayloadAction<IQuizEvaluation>) => {
      let status: string = '';
      if (action.payload?.fail === 0) {
        status = 'success';
      } else if (action.payload?.success === 0) {
        status = 'error';
      } else {
        status = 'warning';
      }

      state.responses[action.payload.id] = {
        options: action.payload.options.map((value: any) => {
          return {
            id: value.id,
            valid: value.valid,
          };
        }),
        response: action.payload.responses,
        status: status,
      };
    },
    clearResponses: (state) => {
      state.responses = [];
    },
  },
});

/* Export the available store actions */
export const {
  loadQuizes,
  appendQuiz,
  updateQuiz,
  deleteQuiz,
  clearQuiz,
  registerResponse,
  clearResponses,
} = quizSlice.actions;

export default quizSlice.reducer;
