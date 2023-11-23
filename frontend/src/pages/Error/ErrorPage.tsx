import React from "react";
import { ThemeProvider } from "@emotion/react";
import { Link } from "react-router-dom";
import { Grid, CssBaseline, Paper, Box, Avatar, Typography, Button } from "@mui/material";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import defaultTheme from "../../theme";

interface Props {
  response: Error | null | string;
}

const ErrorPage: React.FC<Props> = ({ response }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh', width: '100vw'}}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={100} component={Paper} square>
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
              <ErrorIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Error
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {typeof response === 'string' ? response : 'An unexpected error occurred.'}
            </Typography>
            <Button component={Link} to="/" variant="contained" fullWidth sx={{ mt: 2 }}>
              Go to Home
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default ErrorPage;