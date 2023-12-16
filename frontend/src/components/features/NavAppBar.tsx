import { Box, Toolbar, IconButton, Typography, AppBar, Badge, Button } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { AccountCircle, LocalFireDepartmentOutlined } from "@mui/icons-material";
import AlarmButton from "../commons/Buttons/AlarmButton";
import { getAuth } from "@firebase/auth";
import { firebaseApp } from "../../apps/firebase.app";
import Timer from "../../schema/Timer.schema";
import AccountDrawer from "./AccountDrawer/AccountDrawer";
import { useState } from "react";
interface Props {
  timer: Timer
  timeStates: {
    time: number
    running: boolean
  }
}

const NavAppBar: React.FC<Props> = ({ timer, timeStates }) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setOpenDrawer(open);
    };

  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 1000 }}>
      <Toolbar>
        <Typography variant="h6" component="div">
          Strive
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <AlarmButton timer={timer} timeStates={timeStates} />
          <IconButton
            size="large"
            edge="end"
            aria-haspopup="true"
            color="inherit"
            sx={{
              borderRadius: 1,
            }}
            onClick={() => setOpenDrawer(true)}
          >
            <AccountCircle />
          </IconButton>
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            disableRipple
            size="large"
            aria-label="show more"
            aria-haspopup="true"
            color="inherit"
            sx={{
              borderRadius: 1,
            }}
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <AccountDrawer state={openDrawer} toggleDrawer={toggleDrawer} />
    </AppBar>
  );
}
export default NavAppBar