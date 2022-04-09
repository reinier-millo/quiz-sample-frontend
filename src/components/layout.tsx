import '../App.css';
import HeaderLayout from '../components/header';
import { Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';

const theme = createTheme();

export default function LayoutPage() {
  return (
    <div>
      <HeaderLayout />
      <Container sx={{ my: 8 }}>
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>
      </Container>
    </div>
  );
}
