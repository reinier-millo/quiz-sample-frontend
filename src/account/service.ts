import axios, { AxiosResponse } from 'axios';
import { login, updateProfile, logout } from './store';
import { store } from '../app/store';

class Account {
  private static _instance: Account;

  private constructor() {}

  public static get shared(): Account {
    if (!Account._instance) {
      Account._instance = new Account();
    }
    return Account._instance;
  }

  /**
   * Register new user account
   *
   * @param name
   * @param email
   * @param password
   * @returns
   */
  public register(name: any, email: any, password: any) {
    return new Promise<string>((resolve, reject) => {
      axios
        .post(`${process.env.REACT_APP_QUIZ_API}/v1/account/register`, {
          name: name,
          email: email,
          password: password,
        })
        .then(() => {
          resolve(name);
        })
        .catch(reject);
    });
  }

  /**
   * Authenticate user account
   *
   * @param email
   * @param password
   * @returns
   */
  public login(email: any, password: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      axios
        .post(`${process.env.REACT_APP_QUIZ_API}/v1/account/login`, {
          email: email,
          password: password,
        })
        .then((response: AxiosResponse) => {
          localStorage.setItem('token', response.data.token);

          /* Dispatch login action */
          store.dispatch(
            login({
              token: response.data.token,
              uid: response.data.uid,
              name: response.data.name,
              email: response.data.email,
              success: response.data.success,
              fail: response.data.fail,
            })
          );

          resolve(response.data.name);
        })
        .catch(reject);
    });
  }

  /**
   * Logout the current user account
   */
  public logout(): Promise<void> {
    return new Promise<void>((resolve) => {
      const token: string | null = localStorage.getItem('token');
      axios
        .delete(`${process.env.REACT_APP_QUIZ_API}/v1/account/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch(() => {
          /* Prevent error propagation */
        })
        .finally(() => {
          localStorage.removeItem('token');
          store.dispatch(logout());
          resolve();
        });
    });
  }

  /**
   * Validate if an user is authenticated
   *
   * @returns
   */
  public validate(): Promise<void> {
    return new Promise<void>((resolve) => {
      const token: string | null = localStorage.getItem('token');
      if (!token || token.length === 0) {
        logout();
        return resolve();
      }

      axios
        .get(`${process.env.REACT_APP_QUIZ_API}/v1/account`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response: AxiosResponse) => {
          /* Dispatch login action */
          store.dispatch(
            login({
              token: token,
              uid: response.data.uid,
              name: response.data.name,
              email: response.data.email,
              about: response.data.about,
              success: response.data.sucess,
              fail: response.data.fail,
            })
          );
        })
        .catch(() => {
          /* On error ensure state logout */
          store.dispatch(logout());
        })
        .finally(() => {
          resolve();
        });
    });
  }

  /**
   * Update current user profile
   *
   * @param name
   * @param about
   * @returns
   */
  public update(name: any, about: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token: string | null = localStorage.getItem('token');
      axios
        .put(
          `${process.env.REACT_APP_QUIZ_API}/v1/account`,
          {
            name: name,
            about: about,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          /* Dispatch update profile action */
          store.dispatch(
            updateProfile({
              name: name,
              about: about,
            })
          );

          resolve();
        })
        .catch(reject);
    });
  }
}

export const AccountService = Account.shared;
