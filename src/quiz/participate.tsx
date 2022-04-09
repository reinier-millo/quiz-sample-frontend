import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { IQuizDetail, IQuizEvaluation, QuizService } from './service';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addNotification } from '../notifications/store';
import { useNavigate, useParams } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import Avatar from '@mui/material/Avatar';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';

export default function QuizParticipate() {
  let { id } = useParams();

  const [quiz, setQuiz] = useState<any>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const quizState = useAppSelector((state) => state.quiz);

  useEffect(() => {
    /* Load all questions of the current quiz */
    QuizService.fetchDetails(id)
      .then((value: IQuizDetail) => {
        setQuiz(value);
      })
      .catch(() => {
        dispatch(
          addNotification({
            type: 'error',
            message:
              'Se produjo un error inesperado al cargar las preguntas del quiz',
          })
        );
        navigate('/');
      });
    return () => {};
  }, []);

  const handleEvaluation = (idQuestion: any) => {
    return (evt: any) => {
      const htmlObj: any = document.getElementById(`question-${idQuestion}`);

      const data = new FormData(htmlObj);
      const question = quiz.questions.filter(
        (value: any) => value.id === idQuestion
      );
      if (!question || question.length <= 0) {
        dispatch(
          addNotification({
            type: 'error',
            message: `Pregunta no válida, por favor intente de nuevo!`,
          })
        );
        navigate('/');
        return;
      }

      let options: any[] = [];
      if (question[0].type === 1) {
        const option = data.get(`options-${idQuestion}`);

        if (!option) {
          dispatch(
            addNotification({
              type: 'error',
              message: `Debe seleccionar una respuesta válida para poder enviar la respuesta!`,
            })
          );
          return;
        }
        options.push(option);
      } else {
        options = question[0].options
          .map((value: any) => (!!data.get(`${value.id}`) ? value.id : null))
          .filter((value: any) => value !== null);
      }

      /* Send response to the server */
      QuizService.participate(id, idQuestion, options)
        .then((value: IQuizEvaluation) => {
          if (value?.fail === 0) {
            dispatch(
              addNotification({
                type: 'success',
                message: `FELICITACIONES!!! Has acertado con tu respuesta!`,
              })
            );
          } else if (value?.success === 0) {
            dispatch(
              addNotification({
                type: 'error',
                message: `Lo sentimos, no acertaste esta vez, continúa itentándolo!`,
              })
            );
          } else {
            dispatch(
              addNotification({
                type: 'warning',
                message: `No está tan mal, pero tienes que continuar mejorando!`,
              })
            );
          }
        })
        .catch((err) => {
          dispatch(
            addNotification({
              type: 'error',
              message: `Se produjo un error al registrar su participación!`,
            })
          );
        });
    };
  };

  return !quiz ? (
    <Box></Box>
  ) : (
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
            {quiz.name}
          </Typography>
          <Typography>{quiz.description}</Typography>
          <Box component="div" sx={{ mt: 1, width: '100%' }}>
            {quiz.questions.length === 0 ? (
              <h4 className="text-center">
                No se ha encontrado ninguna pregunta
              </h4>
            ) : (
              ''
            )}

            {quiz.questions.map((obj: any) => (
              <Accordion key={obj.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  {quizState.responses[obj.id]?.status === 'success' ? (
                    <Avatar className="bg-success">
                      <CheckCircleIcon />
                    </Avatar>
                  ) : quizState.responses[obj.id]?.status === 'error' ? (
                    <Avatar className="bg-error">
                      <ErrorIcon />
                    </Avatar>
                  ) : quizState.responses[obj.id]?.status === 'warning' ? (
                    <Avatar className="bg-warning">
                      <WarningIcon />
                    </Avatar>
                  ) : (
                    <Avatar>
                      <InfoIcon />
                    </Avatar>
                  )}
                  <Typography align="left" sx={{ flexGrow: 1, ml: 3 }}>
                    {obj.description}
                    <br />
                    {obj.type === 1 ? 'Selección simple' : 'Selección múltiple'}
                  </Typography>
                  <Box className="float-right">
                    <Chip
                      icon={<ThumbUpIcon />}
                      label={obj.success}
                      color="success"
                      sx={{ ml: 2, mt: 2 }}
                    />
                    <Chip
                      icon={<ThumbDownIcon />}
                      label={obj.fail}
                      color="error"
                      sx={{ ml: 2, mt: 2 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box id={'question-' + obj.id} component="form" noValidate>
                    {obj.type === 1 ? (
                      <RadioGroup name={'options-' + obj.id}>
                        <List
                          sx={{ width: '100%', bgcolor: 'background.paper' }}
                        >
                          {obj.options?.map((subobj: any) => (
                            <ListItem key={subobj.id} title={subobj.value}>
                              <FormControlLabel
                                className={
                                  quizState.responses[obj.id]?.options?.filter(
                                    (value: any) => value.id === subobj.id
                                  )[0]?.valid === true
                                    ? 'success'
                                    : 'error'
                                }
                                value={subobj.id}
                                control={
                                  !quizState.responses[obj.id]?.status ? (
                                    <Radio />
                                  ) : (
                                    <Radio
                                      checked={
                                        quizState.responses[
                                          obj.id
                                        ]?.response?.indexOf(subobj.id) >= 0
                                      }
                                      disabled
                                    />
                                  )
                                }
                                label={subobj.value}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </RadioGroup>
                    ) : (
                      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {obj.options?.map((subobj: any) => (
                          <ListItem key={subobj.id} title={subobj.value}>
                            <FormControlLabel
                              className={
                                !quizState.responses[obj.id]?.status
                                  ? ''
                                  : quizState.responses[
                                      obj.id
                                    ]?.options?.filter(
                                      (value: any) => value.id === subobj.id
                                    )[0]?.valid === true
                                  ? 'success'
                                  : 'error'
                              }
                              control={
                                !quizState.responses[obj.id]?.status ? (
                                  <Checkbox name={subobj.id} />
                                ) : (
                                  <Checkbox
                                    name={subobj.id}
                                    checked={
                                      quizState.responses[
                                        obj.id
                                      ]?.response?.indexOf(subobj.id) >= 0
                                    }
                                    disabled
                                  />
                                )
                              }
                              label={subobj.value}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}

                    {!quizState.responses[obj.id]?.status ? (
                      <Button
                        className="float-right"
                        onClick={handleEvaluation(obj.id)}
                      >
                        Enviar respuesta
                      </Button>
                    ) : (
                      <Box></Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
