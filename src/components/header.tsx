import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import AccountMenu from './accountMenu';

export default function HeaderLayout() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Link to="/">
          <img
            src="/favicon/android-chrome-192x192.png"
            alt="Quiz"
            width="48"
          />
        </Link>
        <Typography
          variant="h6"
          component="div"
          align="left"
          sx={{ flexGrow: 1, ml: 3 }}
        >
          <Link className="header-link" to="/">
            Quiz Game
          </Link>
        </Typography>
        <Link className="header-link" to="/">
          Todos los quizes
        </Link>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}
