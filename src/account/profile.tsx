import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { AccountService } from './service';
import { addNotification } from '../notifications/store';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import LoadingButton from '@mui/lab/LoadingButton';
import Person from '@mui/icons-material/Person';

export default function Profile() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [nameError, setNameError] = React.useState<boolean>(false);
  const [nameErrorText, setNameErrorText] = useState<string>('');
  const [invalidUpdate, setInvalidUpdate] = useState<boolean>(false);
  const [invalidUpdateText, setInvalidUpdateText] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  AccountService.validate().catch(() => {
    navigate('/');
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    /* Clear form previous errors */
    setInvalidUpdate(false);
    setInvalidUpdateText('');

    const data = new FormData(event.currentTarget);

    /* Validate name field */
    if (!data.get('username')) {
      setNameError(true);
      setNameErrorText('Su nombre es requerido');

      setIsLoading(false);
      return;
    }

    AccountService.update(data.get('username'), data.get('about'))
      .then(() => {
        dispatch(
          addNotification({
            type: 'success',
            message: `Perfil de usuario actualizado!`,
          })
        );
      })
      .catch(() => {
        setInvalidUpdateText(
          'Se produjo un error al actualizar la información del perfil de usuario'
        );
        setInvalidUpdate(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Grid container component="main" justifyContent="center">
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square>
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
            <Person />
          </Avatar>
          <Typography component="h1" variant="h5">
            Perfil de usuario
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <Collapse in={invalidUpdate} sx={{ mb: 2 }}>
              <Alert severity="error">{invalidUpdateText}</Alert>
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
              value={auth.name}
            />
            <TextField
              margin="normal"
              disabled
              fullWidth
              id="email"
              type="email"
              name="email"
              value={auth.email}
            />
            <TextField
              margin="normal"
              fullWidth
              id="about"
              name="about"
              label="Acerca de mi"
              multiline
              rows={4}
              defaultValue={auth.about}
            />

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isLoading}
              loadingPosition="start"
              startIcon={''}
            >
              Actualizar perfil
            </LoadingButton>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
