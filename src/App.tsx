import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './account/login';
import Register from './account/register';
import AllQuizes from './quiz/all';
import { useAppSelector } from './app/hooks';
import LayoutPage from './components/layout';
import Profile from './account/profile';
import MyQuizes from './quiz/my';
import QuestionDetails from './question/details';
import QuizParticipate from './quiz/participate';

function App() {
  const auth = useAppSelector((state) => state.auth);

  return (
    <Routes>
      <Route
        path="/account/login"
        element={auth.isLogged ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/account/register"
        element={auth.isLogged ? <Navigate to="/" /> : <Register />}
      />

      <Route element={<LayoutPage />}>
        <Route path="/" element={<AllQuizes />} />
        <Route
          path="/profile"
          element={
            !auth.isLogged ? <Navigate to="/account/login" /> : <Profile />
          }
        />
        <Route
          path="/my-quiz"
          element={
            !auth.isLogged ? <Navigate to="/account/login" /> : <MyQuizes />
          }
        />
        <Route
          path="/my-quiz/:id"
          element={
            !auth.isLogged ? (
              <Navigate to="/account/login" />
            ) : (
              <QuestionDetails />
            )
          }
        />
        <Route path="/quiz/:id" element={<QuizParticipate />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
