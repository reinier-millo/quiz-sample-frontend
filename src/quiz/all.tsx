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

export default function AllQuizes() {
  const dispatch = useAppDispatch();
  const quiz = useAppSelector((state) => state.quiz);

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
                <ListItem key={obj.id} divider title={obj.description}>
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
        </Box>
      </Grid>
    </Grid>
  );
}
