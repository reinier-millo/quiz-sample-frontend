import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import Copyright from './components/copyright';
import { useAppDispatch } from '../app/hooks';
import { AccountService } from './service';
import { addNotification } from '../notifications/store';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';

const theme = createTheme();

export default function Register() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [nameError, setNameError] = React.useState<boolean>(false);
  const [nameErrorText, setNameErrorText] = useState<string>('');
  const [emailError, setEmailError] = React.useState<boolean>(false);
  const [emailErrorText, setEmailErrorText] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordErrorText, setPasswordErrorText] = useState<string>('');
  const [invalidRegister, setInvalidRegister] = useState<boolean>(false);
  const [invalidRegisterText, setInvalidRegisterText] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    /* Clear form previous errors */
    setEmailError(false);
    setEmailErrorText('');
    setPasswordError(false);
    setPasswordErrorText('');
    setInvalidRegister(false);
    setInvalidRegisterText('');

    const data = new FormData(event.currentTarget);
    let valid = true;

    /* Validate name field */
    if (!data.get('username')) {
      valid = false;
      setNameError(true);
      setNameErrorText('Su nombre es requerido');
    }

    /* Validate email field */
    if (!data.get('email')) {
      valid = false;
      setEmailError(true);
      setEmailErrorText('Debe introducir su correo electrónico');
    }

    /* Validate password field */
    if (!data.get('password')) {
      valid = false;
      setPasswordError(true);
      setPasswordErrorText('La contraseña es requerida');
    } else {
      /* Validate password field length */
      if ((data.get('password')?.toString() || '').length < 6) {
        valid = false;
        setPasswordError(true);
        setPasswordErrorText(
          'La contraseña debe tener una longitud mínima de 6 caracteres'
        );
      }
    }

    if (!valid) {
      setIsLoading(false);
      return;
    }

    AccountService.register(
      data.get('username'),
      data.get('email'),
      data.get('password')
    )
      .then((name: string) => {
        dispatch(
          addNotification({
            type: 'success',
            message: `${name}, gracias por registrar su cuenta de usuario. Ya puede acceder al sistema!`,
          })
        );
        navigate('/account/login');
      })
      .catch((err: any) => {
        if (err.response?.data?.error === 501) {
          setInvalidRegisterText(
            'Ya existe una cuenta de usuario registrada con ese correo electrónico'
          );
        } else {
          setInvalidRegisterText(
            'Se produjo un error al registrar la nueva cuenta de usuario'
          );
        }
        setInvalidRegister(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/images/quiz-register.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registra tu cuenta de usuario
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <Collapse in={invalidRegister} sx={{ mb: 2 }}>
                <Alert severity="error">{invalidRegisterText}</Alert>
              </Collapse>
              <TextField
                autoComplete="given-name"
                name="username"
                required
                fullWidth
                id="username"
                label="Nombre(s) y apellido(s)"
                helperText={nameErrorText}
                error={nameError}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                type="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                helperText={emailErrorText}
                error={emailError}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="new-password"
                helperText={passwordErrorText}
                error={passwordError}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                Registrar cuenta
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Typography variant="body2" component="span">
                    Ya tienes una cuenta?&nbsp;
                    <Link className="link-primary" to="/account/login">
                      {'Acceder'}
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
