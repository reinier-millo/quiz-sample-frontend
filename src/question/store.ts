import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IQuestion, IQuestionOption } from './service';

export interface IQuestionOptAction {
  question?: string;
  opt?: string;
  value?: string;
  valid?: boolean;
}
export interface QuestionState {
  questions: IQuestion[];
}

/* Question initial state */
const initialState: QuestionState = {
  questions: [],
};

/* Declare the question redux store slice */
export const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    loadQuestions: (state, action: PayloadAction<IQuestion[]>) => {
      state.questions = action.payload;
    },
    appendQuestion: (state, action: PayloadAction<IQuestion>) => {
      state.questions.push(action.payload);
    },
    appendQuestionOpt: (
      state: any,
      action: PayloadAction<IQuestionOptAction>
    ) => {
      const idx = state.questions.findIndex(
        (value: IQuestion) => value.id === action.payload.question
      );
      if (idx >= 0) {
        state.questions[idx].options.push({
          id: action.payload.opt,
          value: action.payload.value,
          valid: action.payload.valid,
        });
      }
    },

    updateQuestion: (state, action: PayloadAction<IQuestion>) => {
      const idx = state.questions.findIndex(
        (value: IQuestion) => value.id === action.payload.id
      );
      if (idx >= 0) {
        state.questions[idx].description = action.payload.description;
      }
    },
    updateQuestionOpt: (
      state: any,
      action: PayloadAction<IQuestionOptAction>
    ) => {
      const idx = state.questions.findIndex(
        (value: IQuestion) => value.id === action.payload.question
      );
      if (idx >= 0) {
        const idx2 = state.questions[idx].options?.findIndex(
          (value: IQuestionOption) => value.id === action.payload.opt
        );
        if (idx2 && idx2 >= 0) {
          const option: any = state.questions[idx].options[idx2];
          option.value = action.payload.value;
          option.valid = action.payload.valid;
        }
      }
    },
    deleteQuestion: (state, action: PayloadAction<string>) => {
      const idx = state.questions.findIndex(
        (value: IQuestion) => value.id === action.payload
      );
      if (idx >= 0) {
        state.questions.splice(idx, 1);
      }
    },
    deleteQuestionOpt: (state, action: PayloadAction<IQuestionOptAction>) => {
      const idx = state.questions.findIndex(
        (value: IQuestion) => value.id === action.payload.question
      );
      if (idx >= 0) {
        const idx2 = state.questions[idx].options?.findIndex(
          (value: IQuestionOption) => value.id === action.payload.opt
        );
        if (idx2 && idx2 >= 0) {
          state.questions[idx].options?.splice(idx2, 1);
        }
      }
    },
    clearQuestions: (state) => {
      state.questions = [];
    },
  },
});

/* Export the available store actions */
export const {
  loadQuestions,
  appendQuestion,
  updateQuestion,
  deleteQuestion,
  clearQuestions,
  appendQuestionOpt,
  updateQuestionOpt,
  deleteQuestionOpt,
} = questionSlice.actions;

export default questionSlice.reducer;
