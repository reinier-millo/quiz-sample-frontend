import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AccountService } from './account/service';
import FloatNotifications from './notifications/notification';

/* Validate is user is authenticated before rendering */
AccountService.validate().finally(() => {
  const container: any = document.getElementById('root');
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <FloatNotifications></FloatNotifications>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
});
