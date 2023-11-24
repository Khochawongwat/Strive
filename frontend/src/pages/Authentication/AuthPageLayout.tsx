import React from 'react';
import { Box, CssBaseline, Grid, Paper } from '@mui/material';
import "./Authentication.css"

interface Props {
    children: any
}

const AuthPageLayout: React.FC<Props> = ({ children }) => {
    return (
        <Grid container component={Paper} square sx={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
        }}>
            <CssBaseline />
            <Grid item sx={{ p: '8%', height: '90%', width: '95vw' }}>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: '80vw',
                            maxWidth: '500px',
                            flexDirection: 'column',
                            alignItems: 'start',
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default AuthPageLayout;
