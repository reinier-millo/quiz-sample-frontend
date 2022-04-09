import axios, { AxiosResponse } from 'axios';
import { store } from '../app/store';
import {
  appendQuiz,
  deleteQuiz,
  loadQuizes,
  registerResponse,
  updateQuiz,
} from './store';

export interface IQuizEvaluation {
  id: string;
  quiz: string;
  success?: number;
  fail?: number;
  options: IQuizDetailQuestionOptions[];
  responses?: string[];
}

export interface IQuiz {
  id: string;
  name: string;
  description: string;
  count?: number;
  success?: number;
  fail?: number;
  createdAt: string;
}

export interface IQuizDetailQuestionOptions {
  id: string;
  value: string;
  valid?: boolean;
}

export interface IQuizDetailQuestion {
  id: string;
  description: string;
  type: number;
  success: number;
  fail: number;
  options: IQuizDetailQuestionOptions[];
}

export interface IQuizDetail {
  id: string;
  name: string;
  description?: string;
  questions: IQuizDetailQuestion[];
}

class Quiz {
  private static _instance: Quiz;

  public static get shared(): Quiz {
    if (!Quiz._instance) {
      Quiz._instance = new Quiz();
    }
    return Quiz._instance;
  }

  /**
   * Create new quiz with the current user
   *
   * @param quizName
   * @param quizDescription
   * @returns
   */
  public create(quizName: any, quizDescription: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .post(
          `${process.env.REACT_APP_QUIZ_API}/v1/quiz`,
          {
            name: quizName,
            description: quizDescription,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          store.dispatch(
            appendQuiz({
              id: response.data?.id,
              name: quizName,
              description: quizDescription,
              count: 0,
              success: 0,
              fail: 0,
              createdAt: new Date().toLocaleString(),
            })
          );
          resolve(response.data?.id);
        })
        .catch(reject);
    });
  }

  /**
   * Update the information of a quiz
   *
   * @param id
   * @param quizName
   * @param quizDescription
   * @returns
   */
  public update(id: any, quizName: any, quizDescription: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .put(
          `${process.env.REACT_APP_QUIZ_API}/v1/quiz/${id}`,
          {
            name: quizName,
            description: quizDescription,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          store.dispatch(
            updateQuiz({
              id: id,
              name: quizName,
              description: quizDescription,
              createdAt: 'ignored',
            })
          );
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Delete the given quiz
   *
   * @param id
   * @returns
   */
  public delete(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .delete(`${process.env.REACT_APP_QUIZ_API}/v1/quiz/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          store.dispatch(deleteQuiz(id));
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Fetch all available quizes that are owned by the current user
   *
   * @returns
   */
  public fetchMyQuiz(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .get(`${process.env.REACT_APP_QUIZ_API}/v1/quiz/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response: AxiosResponse) => {
          store.dispatch(
            loadQuizes(
              response.data.map((value: any) => {
                return {
                  id: value.id,
                  name: value.name,
                  description: value.description,
                  count: value.count,
                  success: value.success,
                  fail: value.fail,
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
   * Fetch all available quizes
   *
   * @returns
   */
  public fetchAllQuiz(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axios
        .get(`${process.env.REACT_APP_QUIZ_API}/v1/quiz`)
        .then((response: AxiosResponse) => {
          store.dispatch(
            loadQuizes(
              response.data.map((value: any) => {
                return {
                  id: value.id,
                  name: value.name,
                  description: value.description,
                  count: value.count,
                  success: value.success,
                  fail: value.fail,
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
   * Fetch all available quizes
   *
   * @returns
   */
  public fetchDetails(id: any): Promise<IQuizDetail> {
    return new Promise<IQuizDetail>((resolve, reject) => {
      axios
        .get(`${process.env.REACT_APP_QUIZ_API}/v1/quiz/${id}`)
        .then((response: AxiosResponse) => {
          resolve({
            id: response.data.id,
            name: response.data.name,
            description: response.data.description,
            questions: response.data.questions.map((value: any) => {
              return {
                id: value.id,
                description: value.description,
                type: value.type,
                success: value.success,
                fail: value.fail,
                options: value.options.map((opt: any) => {
                  return {
                    id: opt._id,
                    value: opt.value,
                  };
                }),
              };
            }),
          });
        })
        .catch(reject);
    });
  }

  public participate(
    quiz: any,
    question: any,
    responses: any
  ): Promise<IQuizEvaluation> {
    return new Promise<IQuizEvaluation>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');

      axios
        .post(
          `${process.env.REACT_APP_QUIZ_API}/v1/quiz/${quiz}/participate`,
          {
            question: question,
            responses: responses,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          const evaluation = {
            id: question,
            quiz: quiz,
            success: response.data.success,
            fail: response.data.fail,
            options: response.data.options,
            responses: responses,
          };

          store.dispatch(registerResponse(evaluation));

          resolve(evaluation);
        })
        .catch(reject);
    });
  }
}

export const QuizService = Quiz.shared;
