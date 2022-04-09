import axios, { AxiosResponse } from 'axios';
import { store } from '../app/store';
import {
  appendQuestion,
  appendQuestionOpt,
  deleteQuestion,
  deleteQuestionOpt,
  loadQuestions,
  updateQuestion,
  updateQuestionOpt,
} from './store';

export interface IQuestionOption {
  id?: string;
  value: string;
  valid: boolean;
}

export interface IQuestion {
  id?: string;
  description: string;
  type?: number;
  options?: IQuestionOption[];
  createdAt?: string;
}

class Question {
  private static _instance: Question;

  private constructor() {}

  public static get shared(): Question {
    if (!Question._instance) {
      Question._instance = new Question();
    }
    return Question._instance;
  }

  /**
   * Create new question into the given quiz
   *
   * @param quiz
   * @param description
   * @param type
   * @param options
   * @returns
   */
  public create(
    quiz: any,
    description: any,
    type: any,
    options: any
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .post(
          `${process.env.REACT_APP_QUIZ_API}/v1/question/${quiz}`,
          {
            description: description,
            type: type,
            options: options,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          store.dispatch(
            appendQuestion({
              id: response.data?.id,
              description: description,
              type: type,
              options: options,
              createdAt: new Date().toLocaleString(),
            })
          );
          resolve(response.data?.id);
        })
        .catch(reject);
    });
  }

  /**
   * Update the information of a question
   *
   * @param id
   * @param description
   * @returns
   */
  public update(id: any, description: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .put(
          `${process.env.REACT_APP_QUIZ_API}/v1/question/${id}`,
          {
            description: description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          store.dispatch(
            updateQuestion({
              description: description,
            })
          );
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Delete the given question
   *
   * @param id
   * @returns
   */
  public delete(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .delete(`${process.env.REACT_APP_QUIZ_API}/v1/question/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          store.dispatch(deleteQuestion(id));
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Fetch all question from a quiz
   *
   * @returns
   */
  public fetchFromQuiz(quiz: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .get(`${process.env.REACT_APP_QUIZ_API}/v1/question/${quiz}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response: AxiosResponse) => {
          store.dispatch(
            loadQuestions(
              response.data.map((value: any) => {
                return {
                  id: value.id,
                  description: value.description,
                  type: value.type,
                  options: value.options,
                  createdAt: new Date(value.createdAt).toLocaleString(),
                };
              })
            )
          );
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Create new question into the given quiz
   *
   * @param quiz
   * @param description
   * @param type
   * @param options
   * @returns
   */
  public createOpt(parent: any, value: any, valid: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .post(
          `${process.env.REACT_APP_QUIZ_API}/v1/question/${parent}/option`,
          {
            value: value,
            valid: valid,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          store.dispatch(
            appendQuestionOpt({
              question: parent,
              opt: response.data?.id,
              value: value,
              valid: valid,
            })
          );
          resolve(response.data?.id);
        })
        .catch(reject);
    });
  }

  /**
   * Update the information of a answer option
   *
   * @param parent
   * @param id
   * @param value
   * @param valid
   * @returns
   */
  public updateOpt(
    parent: any,
    id: any,
    value: any,
    valid: any
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .put(
          `${process.env.REACT_APP_QUIZ_API}/v1/question/${parent}/option/${id}`,
          {
            value: value,
            valid: valid,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          store.dispatch(
            updateQuestionOpt({
              question: parent,
              opt: id,
              value: value,
              valid: valid,
            })
          );
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Delete an answer option
   *
   * @param parent
   * @param id
   * @returns
   */
  public deleteOpt(parent: any, id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .delete(
          `${process.env.REACT_APP_QUIZ_API}/v1/question/${parent}/option/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          store.dispatch(
            deleteQuestionOpt({
              question: parent,
              opt: id,
            })
          );
          resolve();
        })
        .catch(reject);
    });
  }
}

export const QuestionService = Question.shared;
