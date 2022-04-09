import React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { closeNotification, nextNotification } from './store';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { store } from '../app/store';

export default function FloatNotifications() {
  const notification = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();
  const handleClose: any = (_evt?: any, reason?: any) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(closeNotification());
  };

  store.subscribe(() => {
    const state = store.getState();
    if (!state.notifications.isActive && state.notifications.stack.length > 0) {
      dispatch(nextNotification());
    }
  });

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={notification.isActive}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
