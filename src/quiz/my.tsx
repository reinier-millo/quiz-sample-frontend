import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Quiz from '@mui/icons-material/Quiz';
import Edit from '@mui/icons-material/Edit';
import Settings from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import { IQuiz, QuizService } from './service';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addNotification } from '../notifications/store';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import DialogContentText from '@mui/material/DialogContentText';
import { clearQuiz } from './store';
import { useNavigate } from 'react-router-dom';

export default function MyQuizes() {
  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editName, setEditName] = React.useState<string>('');
  const [editDescription, setEditDescription] = React.useState<string>('');
  const [nameError, setNameError] = React.useState<boolean>(false);
  const [nameErrorText, setNameErrorText] = useState<string>('');
  const [invalidUpdate, setInvalidUpdate] = useState<boolean>(false);
  const [invalidUpdateText, setInvalidUpdateText] = useState<string>('');

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [objId, setObjId] = useState<string>('');

  const dispatch = useAppDispatch();
  const quiz = useAppSelector((state) => state.quiz);
  const navigate = useNavigate();

  const quizDetails = (id: string) => {
    return () => {
      navigate(`/my-quiz/${id}`);
    };
  };

  const addQuiz = () => {
    setIsNew(true);
    setEditName('');
    setEditDescription('');
    setOpenEditor(true);
  };

  const editQuiz = (id: string) => {
    return () => {
      setIsNew(false);
      setObjId(id);
      const idx = quiz.quizes.findIndex((value: IQuiz) => value.id === id);
      if (idx >= 0) {
        setEditName(quiz.quizes[idx].name);
        setEditDescription(quiz.quizes[idx].description);
      }
      setOpenEditor(true);
    };
  };

  const deleteQuiz = (id: string) => {
    return () => {
      setObjId(id);
      setOpenDelete(true);
    };
  };

  const handleCloseDelete = (_evt: any, reason?: any) => {
    if (reason === 'backdropClick') {
      return;
    }

    setObjId('');
    setOpenDelete(false);
  };

  const handleConfirmDelete = () => {
    QuizService.delete(objId)
      .then(() => {
        dispatch(
          addNotification({
            type: 'success',
            message: 'Quiz eliminado',
          })
        );
        QuizService.fetchMyQuiz();
      })
      .catch(() => {
        dispatch(
          addNotification({
            type: 'error',
            message: 'Se produjo un error inesperado al eliminar el quiz',
          })
        );
      })
      .finally(() => {
        setObjId('');
        setOpenDelete(false);
      });
  };

  const handleClose = (_evt: any, reason?: any) => {
    if (reason === 'backdropClick') {
      return;
    }

    setOpenEditor(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(true);

    /* Clear form previous errors */
    setNameError(false);
    setNameErrorText('');
    setInvalidUpdate(false);
    setInvalidUpdateText('');

    const data = new FormData(event.currentTarget);

    /* Validate name field */
    const quizName: any = data.get('quizName');
    if (!quizName || quizName.length <= 0) {
      setNameError(true);
      setNameErrorText('Debe indicar el nombre del quiz');

      setIsEditing(false);
      return;
    }

    if (isNew) {
      QuizService.create(quizName, data.get('quizDescription'))
        .then(() => {
          dispatch(
            addNotification({
              type: 'success',
              message: 'Nuevo quiz guardado',
            })
          );
          QuizService.fetchMyQuiz();
          setOpenEditor(false);
        })
        .catch(() => {
          setInvalidUpdate(true);
          setInvalidUpdateText('Se produjo un error al crear el quiz');
        })
        .finally(() => {
          setIsEditing(false);
        });
    } else {
      QuizService.update(objId, quizName, data.get('quizDescription'))
        .then(() => {
          dispatch(
            addNotification({
              type: 'success',
              message: 'Información del quiz actualizada',
            })
          );
          QuizService.fetchMyQuiz();
          setOpenEditor(false);
        })
        .catch(() => {
          setInvalidUpdate(true);
          setInvalidUpdateText('Se produjo un error al actualizar el quiz');
        })
        .finally(() => {
          setIsEditing(false);
        });
    }
  };

  useEffect(() => {
    /* Load all quizes of the current user */
    QuizService.fetchMyQuiz().catch(() => {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Se produjo un error inesperado al cargar los quizes',
        })
      );
    });
    return () => {
      dispatch(clearQuiz());
    };
  }, []);

  return (
    <Grid container component="main" justifyContent="center">
      <Grid item xs={12} sm={10} md={8} component={Paper} elevation={0} square>
        <Box
          sx={{
            my: 6,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Mis quizes
          </Typography>
          <Box component="div" sx={{ mt: 1, width: '100%' }}>
            {quiz.quizes.length === 0 ? (
              <h4 className="text-center">No se ha encontrado ningún quiz</h4>
            ) : (
              ''
            )}
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {quiz.quizes.map((obj) => (
                <ListItem
                  key={obj.id}
                  divider
                  title={obj.description}
                  secondaryAction={
                    <div>
                      <IconButton
                        edge="end"
                        color="warning"
                        aria-label="settings"
                        onClick={quizDetails(obj.id)}
                        title="Detalles del quiz"
                      >
                        <Settings />
                      </IconButton>
                      <IconButton
                        edge="end"
                        color="primary"
                        aria-label="edit"
                        onClick={editQuiz(obj.id)}
                        title="Editar quiz"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        edge="end"
                        color="error"
                        aria-label="delete"
                        onClick={deleteQuiz(obj.id)}
                        title="Eliminar quiz"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Quiz />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={obj.name} secondary={obj.createdAt} />
                </ListItem>
              ))}
            </List>
          </Box>
          <Fab
            className="plus-btn"
            color="primary"
            aria-label="add"
            onClick={addQuiz}
          >
            <AddIcon />
          </Fab>
          <Dialog open={openEditor} onClose={handleClose}>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <DialogTitle>
                {isNew ? 'Agregar quiz' : 'Editar quiz'}
              </DialogTitle>
              <DialogContent>
                <Collapse in={invalidUpdate} sx={{ mb: 2 }}>
                  <Alert severity="error">{invalidUpdateText}</Alert>
                </Collapse>
                <TextField
                  autoFocus
                  margin="normal"
                  id="quizName"
                  name="quizName"
                  label="Nombre del quiz"
                  fullWidth
                  required
                  helperText={nameErrorText}
                  error={nameError}
                  defaultValue={editName}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="quizDescription"
                  name="quizDescription"
                  label="Acerca del Quiz"
                  multiline
                  rows={4}
                  defaultValue={editDescription}
                />
              </DialogContent>
              <DialogActions>
                <Button disabled={isEditing} onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isEditing}>
                  Guardar
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
          <Dialog
            open={openDelete}
            onClose={handleCloseDelete}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{'Desea eliminar el Quiz?'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Una vez eliminado el Quiz la información del mismo se perderá.
                Desea continuar con la eliminación del Quiz?.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelete}>Cancelar</Button>
              <Button onClick={handleConfirmDelete}>Eliminar</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Grid>
    </Grid>
  );
}
