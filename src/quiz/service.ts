import axios, { AxiosResponse } from 'axios';
import { store } from '../app/store';
import { appendQuiz, deleteQuiz, loadQuizes, updateQuiz } from './store';

export interface IQuiz {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

class Quiz {
  private static _instance: Quiz;

  private constructor() {}

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
}

export const QuizService = Quiz.shared;
