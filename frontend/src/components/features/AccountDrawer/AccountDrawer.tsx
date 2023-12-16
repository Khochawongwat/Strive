import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Grid, IconButton, Typography } from '@mui/material';
import { Close, Logout } from '@mui/icons-material';
import { priorityPalette } from '../../../theme';
import { firebaseAuth } from '../../../services/auth.service';

interface Props {
    state: boolean
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void
}
const AccountDrawer: React.FC<Props> = ({ state, toggleDrawer }) => {

    const handleSignOut = async()=>{
        await firebaseAuth.signOut()
        localStorage.removeItem('timer')
    }

    return (
        <SwipeableDrawer
            anchor="right"
            open={state}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
        >
            <Grid sx={{
                display: { xs: 'none', md: 'flex' },
                width: '20vw',
                justifyContent: 'center',
                flexDirection: 'column', 
                padding: '12px',
            }}>
                <IconButton onClick={toggleDrawer(false)} sx = {{borderRadius: '6px'}}>
                    <Close/>
                </IconButton>
                <IconButton onClick={handleSignOut} sx={{mt: '24px', display: 'flex', bgcolor: priorityPalette[4], borderRadius: '6px' }}>
                    <Logout />
                    <Typography>
                        Log out
                    </Typography>
                </IconButton>
            </Grid>
        </SwipeableDrawer>
    );
}

export default AccountDrawer