import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from './components/copyright';
import { AccountService } from './service';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { useNavigate } from 'react-router-dom';
import { addNotification } from '../notifications/store';
import { useAppDispatch } from '../app/hooks';
import LoadingButton from '@mui/lab/LoadingButton';

const theme = createTheme();

export default function Login() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailErrorText, setEmailErrorText] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordErrorText, setPasswordErrorText] = useState<string>('');
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);

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
    setInvalidCredentials(false);

    const data = new FormData(event.currentTarget);
    let valid = true;

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
    }

    if (!valid) {
      setIsLoading(false);
      return;
    }

    AccountService.login(data.get('email'), data.get('password'))
      .then((name: string) => {
        dispatch(
          addNotification({ type: 'success', message: `Bienvenido ${name}!` })
        );
        navigate('/');
      })
      .catch(() => {
        setInvalidCredentials(true);
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
            backgroundImage: 'url(/images/quiz-login.jpg)',
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
              Accede a tu cuenta de usuario
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <Collapse in={invalidCredentials} sx={{ mb: 2 }}>
                <Alert severity="error">
                  Combinación de correo/contraseña incorrecta
                </Alert>
              </Collapse>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                type="email"
                autoComplete="email"
                helperText={emailErrorText}
                error={emailError}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={passwordErrorText}
                error={passwordError}
              />
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={isLoading}
                startIcon={<span />}
                loadingPosition="start"
              >
                Iniciar sesión
              </LoadingButton>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Typography variant="body2" component="span">
                    No tienes una cuenta aún?&nbsp;
                    <Link className="link-primary" to="/account/register">
                      {'Registrar'}
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
