import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Edit from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { IQuestion, IQuestionOption, QuestionService } from './service';
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
import { clearQuestions } from './store';
import { useNavigate, useParams } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function QuestionDetails() {
  const { id } = useParams();

  const [objId, setObjId] = useState<string>('');
  const [optId, setOptId] = useState<string>('');

  const [openOptEditor, setOpenOptEditor] = useState<boolean>(false);
  const [openOptDelete, setOpenOptDelete] = useState<boolean>(false);
  const [editOptResponse, setEditOptResponse] = React.useState<string>('');
  const [editOptValid, setEditOptValid] = React.useState<boolean>(false);
  const [optResponseError, setOptResponseError] =
    React.useState<boolean>(false);
  const [optResponseErrorText, setOptResponseErrorText] = useState<string>('');

  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editStrQuestion, setEditStrQuestion] = React.useState<string>('');
  const [questionError, setQuestionError] = React.useState<boolean>(false);
  const [questionErrorText, setQuestionErrorText] = useState<string>('');
  const [questionOptions, setQuestionOptions] = useState<string[]>([]);
  const [optionsCnt, setOptionsCnt] = useState<number>(0);
  const [invalidUpdate, setInvalidUpdate] = useState<boolean>(false);
  const [invalidUpdateText, setInvalidUpdateText] = useState<string>('');
  const [optionError, setOptionError] = React.useState<boolean>(false);
  const [optionErrorText, setOptionErrorText] = useState<string>('');

  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const question: any = useAppSelector((state) => state.question);
  const navigate = useNavigate();

  const clearErrors = () => {
    setQuestionError(false);
    setQuestionErrorText('');
    setInvalidUpdate(false);
    setInvalidUpdateText('');
    setOptionError(false);
    setOptionErrorText('');
    setOptResponseError(false);
    setOptResponseErrorText('');
  };

  useEffect(() => {
    /* Load all questions of the current quiz */
    QuestionService.fetchFromQuiz(id).catch(() => {
      dispatch(
        addNotification({
          type: 'error',
          message:
            'Se produjo un error inesperado al cargar las preguntas del quiz',
        })
      );
      navigate('/my-quiz');
    });
    return () => {
      dispatch(clearQuestions());
    };
  }, []);

  const addOpt = (parent: any) => {
    return () => {
      clearErrors();
      setIsEditing(false);
      setInvalidUpdate(false);
      setIsNew(true);
      setObjId(parent);
      setEditOptResponse('');
      setEditOptValid(false);
      setOpenOptEditor(true);
    };
  };

  const editOpt = (parent: any, id: any) => {
    return () => {
      clearErrors();
      setIsEditing(false);
      setIsNew(false);
      setInvalidUpdate(false);
      setObjId(parent);
      setOptId(id);

      const idx = question.questions.findIndex(
        (value: IQuestion) => value.id === parent
      );
      if (idx >= 0) {
        const idx2 = question.questions[idx].options?.findIndex(
          (value: IQuestionOption) => value.id === id
        );
        if (idx2 && idx2 >= 0) {
          const option: any = question.questions[idx].options[idx2];
          setEditOptResponse(option.value);
          setEditOptValid(option.valid);
        }
      }

      setOpenOptEditor(true);
    };
  };

  const handleOptClose = (_evt: any, reason?: any) => {
    if (reason === 'backdropClick') {
      return;
    }

    setOpenOptEditor(false);
  };

  const handleOptSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(true);

    /* Clear form previous errors */
    setOptResponseError(false);
    setOptResponseErrorText('');
    setInvalidUpdate(false);
    setInvalidUpdateText('');

    const data = new FormData(event.currentTarget);

    /* Validate name field */
    const optValue: any = data.get('optValue');
    if (!optValue || optValue.length <= 0) {
      setOptResponseError(true);
      setOptResponseErrorText('Debe indicar el valor de la respuesta');

      setIsEditing(false);
      return;
    }

    if (isNew) {
      QuestionService.createOpt(objId, optValue, !!data.get('optValid'))
        .then(() => {
          dispatch(
            addNotification({
              type: 'success',
              message: 'Nueva opción guardada',
            })
          );
          QuestionService.fetchFromQuiz(id);
          setOpenOptEditor(false);
        })
        .catch((err) => {
          if (err.response.data.error === 1006) {
            setInvalidUpdateText('No pueden haber más de una respuesta válida');
          }
          if (err.response.data.error === 1005) {
            setInvalidUpdateText(
              'Se alcanzó el número máximo de opciones permitidas'
            );
          } else {
            setInvalidUpdateText(
              'Se produjo un error al guardar la nueva opción'
            );
          }
          setInvalidUpdate(true);
        })
        .finally(() => {
          setIsEditing(false);
        });
    } else {
      QuestionService.updateOpt(objId, optId, optValue, !!data.get('optValid'))
        .then(() => {
          dispatch(
            addNotification({
              type: 'success',
              message: 'Información de la opción actualizada',
            })
          );
          QuestionService.fetchFromQuiz(id);
          setOpenOptEditor(false);
        })
        .catch((err: any) => {
          if (err.response.data.error === 1006) {
            setInvalidUpdateText('No pueden haber más de una respuesta válida');
          } else {
            setInvalidUpdateText('Se produjo un error al actualizar la opción');
          }
          setInvalidUpdate(true);
        })
        .finally(() => {
          setIsEditing(false);
        });
    }
  };

  const deleteOpt = (parent: any, id: any) => {
    return () => {
      setObjId(parent);
      setOptId(id);
      setOpenOptDelete(true);
    };
  };

  const handleOptCloseDelete = (_evt: any, reason?: any) => {
    if (reason === 'backdropClick') {
      return;
    }

    setObjId('');
    setOptId('');
    setOpenOptDelete(false);
  };

  const handleOptConfirmDelete = () => {
    QuestionService.deleteOpt(objId, optId)
      .then(() => {
        dispatch(
          addNotification({
            type: 'success',
            message: 'Opción de respuesta eliminada',
          })
        );
        QuestionService.fetchFromQuiz(id);
      })
      .catch((err: any) => {
        if (err.response?.data?.error === 1004) {
          dispatch(
            addNotification({
              type: 'error',
              message: 'Se alcanzó el número mínimo de opciones',
            })
          );
        } else {
          dispatch(
            addNotification({
              type: 'error',
              message:
                'Se produjo un error inesperado al eliminar la opción de respuesta',
            })
          );
        }
      })
      .finally(() => {
        setObjId('');
        setOptId('');
        setOpenOptDelete(false);
      });
  };

  const deleteOptQuestion = (idx: any) => {
    return () => {
      if (questionOptions.length <= 2) {
        return;
      }
      const tmpArr = questionOptions.slice();
      tmpArr.splice(idx, 1);
      setQuestionOptions(tmpArr);
    };
  };

  const addQuestion = () => {
    clearErrors();
    setIsEditing(false);
    setIsNew(true);
    setEditStrQuestion('');
    setOptionsCnt(2);
    setQuestionOptions(['qoption-1', 'qoption-2']);
    setOpenEditor(true);
  };

  const addQuestionOptions = () => {
    if (questionOptions.length >= 10) {
      return;
    }
    const opt = optionsCnt + 1;
    setOptionsCnt(opt);
    const newOpts = questionOptions.slice();
    newOpts.push(`qoption-${opt}`);
    setQuestionOptions(newOpts);
  };

  const editQuestion = (id: any) => {
    return () => {
      clearErrors();
      setIsEditing(false);
      setIsNew(false);
      setObjId(id);
      const idx = question.questions.findIndex(
        (value: IQuestion) => value.id === id
      );
      if (idx >= 0) {
        setEditStrQuestion(question.questions[idx].description);
      }
      setOpenEditor(true);
    };
  };

  const deleteQuestion = (id: any) => {
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
    QuestionService.delete(objId)
      .then(() => {
        dispatch(
          addNotification({
            type: 'success',
            message: 'Pregunta eliminada',
          })
        );
        QuestionService.fetchFromQuiz(id);
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
    setQuestionError(false);
    setQuestionErrorText('');
    setInvalidUpdate(false);
    setInvalidUpdateText('');
    setOptionError(false);
    setOptionErrorText('');

    const data = new FormData(event.currentTarget);

    /* Validate name field */
    const questionStr: any = data.get('question');
    if (!questionStr || questionStr.length <= 0) {
      setQuestionError(true);
      setQuestionErrorText('La pregunta es requerida');

      setIsEditing(false);
      return;
    }

    if (isNew) {
      const type = data.get('questionType') === 'single' ? 1 : 2;
      let valid = true;
      const options = questionOptions.map((value: string) => {
        const tmpValue: any = data.get(value);
        if (!tmpValue || tmpValue.length <= 0) {
          valid = false;
        }
        return {
          value: tmpValue,
          valid: false,
        };
      });

      if (!valid) {
        setIsEditing(false);
        setOptionError(true);
        setOptionErrorText('Debe completar todas las opciones');
        return;
      }

      QuestionService.create(id, questionStr, type, options)
        .then(() => {
          dispatch(
            addNotification({
              type: 'success',
              message: 'Nueva pregunta guardada',
            })
          );
          QuestionService.fetchFromQuiz(id);
          setOpenEditor(false);
        })
        .catch(() => {
          setInvalidUpdate(true);
          setInvalidUpdateText(
            'Se produjo un error al crear la nueva pregunta'
          );
        })
        .finally(() => {
          setIsEditing(false);
        });
    } else {
      QuestionService.update(objId, questionStr)
        .then(() => {
          dispatch(
            addNotification({
              type: 'success',
              message: 'Información de la pregunta actualizada',
            })
          );
          QuestionService.fetchFromQuiz(id);
          setOpenEditor(false);
        })
        .catch(() => {
          setInvalidUpdate(true);
          setInvalidUpdateText(
            'Se produjo un error al actualizar al actualizar la pregunta'
          );
        })
        .finally(() => {
          setIsEditing(false);
        });
    }
  };

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
            Detalles del Quiz
          </Typography>
          <Typography>
            <Link className="link-primary" to="/my-quiz">
              Regresar a mis Quizes
            </Link>
          </Typography>
          <Box component="div" sx={{ mt: 1, width: '100%' }}>
            {question.questions.length === 0 ? (
              <h4 className="text-center">
                No se ha encontrado ninguna pregunta
              </h4>
            ) : (
              ''
            )}

            {question.questions.map((obj: any) => (
              <Accordion key={obj.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography align="left" sx={{ flexGrow: 1, ml: 3 }}>
                    {obj.description}
                    <br />
                    {obj.type === 1 ? 'Selección simple' : 'Selección múltiple'}
                  </Typography>
                  <Box>
                    <Chip
                      icon={<ThumbUpIcon />}
                      label={obj.success}
                      color="success"
                      sx={{ ml: 2, mt: 2 }}
                      title="Número de aciertos"
                    />
                    <Chip
                      icon={<ThumbDownIcon />}
                      label={obj.fail}
                      color="error"
                      sx={{ ml: 2, mt: 2 }}
                      title="Número de desaciertos"
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <IconButton
                      edge="end"
                      color="primary"
                      aria-label="edit"
                      onClick={editQuestion(obj.id)}
                      title="Editar pregunta"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      aria-label="delete"
                      onClick={deleteQuestion(obj.id)}
                      title="Eliminar pregunta"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {obj.options?.map((subobj: any) => (
                      <ListItem
                        key={subobj.id}
                        title={subobj.value}
                        className={
                          subobj.valid ? 'valid-response' : 'invalid-response'
                        }
                        secondaryAction={
                          <Box>
                            <IconButton
                              edge="end"
                              color="primary"
                              aria-label="edit"
                              onClick={editOpt(obj.id, subobj.id)}
                              title="Editar quiz"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              edge="end"
                              color="error"
                              aria-label="delete"
                              onClick={deleteOpt(obj.id, subobj.id)}
                              title="Eliminar quiz"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={subobj.value}
                          secondary={
                            subobj.valid
                              ? 'Respuesta correcta'
                              : 'Respuesta incorrecta'
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button onClick={addOpt(obj.id)}>Agregar nueva opción</Button>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          <Fab
            className="plus-btn"
            color="primary"
            aria-label="add"
            title="Agregar pregunta"
            onClick={addQuestion}
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
                {isNew ? 'Agregar pregunta' : 'Editar pregunta'}
              </DialogTitle>
              <DialogContent>
                <Collapse in={invalidUpdate} sx={{ mb: 2 }}>
                  <Alert severity="error">{invalidUpdateText}</Alert>
                </Collapse>
                <TextField
                  margin="normal"
                  id="question"
                  name="question"
                  label="Pregunta"
                  fullWidth
                  required
                  helperText={questionErrorText}
                  error={questionError}
                  defaultValue={editStrQuestion}
                />
                {isNew ? (
                  <Box>
                    <FormLabel id="question-type-label">
                      Tipo de pregunta
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="question-type-label"
                      defaultValue="single"
                      name="questionType"
                    >
                      <FormControlLabel
                        value="single"
                        control={<Radio />}
                        label="Selección simple"
                      />
                      <FormControlLabel
                        value="multiple"
                        control={<Radio />}
                        label="Selección múltiple"
                      />
                    </RadioGroup>
                    <Divider />
                    <FormLabel id="question-answers-label">
                      Opciones de respuesta
                    </FormLabel>
                    <Box>
                      <small>
                        Debe indicar un mínimo de 2 opciones y un máximo de 10.
                      </small>
                    </Box>
                    {questionOptions?.map((obj: any, idx: number) => (
                      <Box key={obj}>
                        <TextField
                          margin="normal"
                          id={obj}
                          name={obj}
                          label="Respuesta"
                          fullWidth
                          required
                        />
                        {idx >= 2 ? (
                          <Typography
                            variant="caption"
                            component="small"
                            className="remove-action float-right"
                            onClick={deleteOptQuestion(idx)}
                          >
                            Eliminar
                          </Typography>
                        ) : (
                          ''
                        )}
                      </Box>
                    ))}
                    {questionOptions.length < 10 ? (
                      <Box>
                        <Button
                          disabled={isEditing}
                          onClick={addQuestionOptions}
                        >
                          Agregar opción
                        </Button>
                      </Box>
                    ) : (
                      ''
                    )}
                    <Collapse in={optionError} sx={{ mb: 2 }}>
                      <Alert severity="error">{optionErrorText}</Alert>
                    </Collapse>
                  </Box>
                ) : (
                  ''
                )}
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
            <DialogTitle>{'Desea eliminar la pregunta?'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Una vez eliminada la pregunta la información de la misma se
                perderá. Desea continuar con la eliminación de la pregunta?.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelete}>Cancelar</Button>
              <Button onClick={handleConfirmDelete}>Eliminar</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openOptEditor} onClose={handleOptClose}>
            <Box
              component="form"
              noValidate
              onSubmit={handleOptSubmit}
              sx={{ mt: 1 }}
            >
              <DialogTitle>
                {isNew
                  ? 'Agregar opción de respuesta'
                  : 'Editar opción de respuesta'}
              </DialogTitle>
              <DialogContent>
                <Collapse in={invalidUpdate} sx={{ mb: 2 }}>
                  <Alert severity="error">{invalidUpdateText}</Alert>
                </Collapse>
                <TextField
                  margin="normal"
                  id="optValue"
                  name="optValue"
                  label="Respuesta"
                  fullWidth
                  required
                  helperText={optResponseErrorText}
                  error={optResponseError}
                  defaultValue={editOptResponse}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="optValid"
                      id="optValid"
                      defaultChecked={editOptValid}
                    />
                  }
                  label="Respuesta correcta"
                />
              </DialogContent>
              <DialogActions>
                <Button disabled={isEditing} onClick={handleOptClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isEditing}>
                  Guardar
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
          <Dialog
            open={openOptDelete}
            onClose={handleOptCloseDelete}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>
              {'Desea eliminar la opción de respuesta?'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Una vez eliminado la opción la información de la misma se
                perderá. Desea continuar con la eliminación de la opción de
                respuesta?.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOptCloseDelete}>Cancelar</Button>
              <Button onClick={handleOptConfirmDelete}>Eliminar</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Grid>
    </Grid>
  );
}
