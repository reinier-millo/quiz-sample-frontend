import React, { useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Quiz from '@mui/icons-material/Quiz';
import { QuizService } from './service';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addNotification } from '../notifications/store';
import { clearQuiz } from './store';
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function AllQuizes() {
  const dispatch = useAppDispatch();
  const quiz = useAppSelector((state) => state.quiz);
  const navigate = useNavigate();

  useEffect(() => {
    /* Load all quizes of the current user */
    QuizService.fetchAllQuiz().catch(() => {
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

  const participate = (id: any) => {
    return () => {
      navigate(`/quiz/${id}`);
    };
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
            Quizes
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
                  onClick={participate(obj.id)}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={obj.count}
                      title="Cantidad de preguntas"
                      color="primary"
                    >
                      <Avatar>
                        <Quiz />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={obj.name}
                    secondary={obj.description}
                  />
                  <Box className="float-right">
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
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
