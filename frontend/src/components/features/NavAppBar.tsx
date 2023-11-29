import { Box, Toolbar, IconButton, Typography, AppBar, Badge } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { AccountCircle, LocalFireDepartmentOutlined, TimerOutlined, WaterDropOutlined } from "@mui/icons-material";
import { useState } from "react";
import AlarmButton from "../commons/Buttons/AlarmButton";
interface Props {

}

const NavAppBar: React.FC<Props> = ({ }) => {

  return (
    <Box sx={{ flexGrow: 1, userSelect: 'none', bgcolor: 'transparent' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Strive
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex'} }}>
            <AlarmButton />
            <IconButton size="large" disableRipple color="inherit" sx={{
              borderRadius: 1,
            }}>
              <LocalFireDepartmentOutlined />
            </IconButton>
            <IconButton
              size="large"
              disableRipple
              color="inherit"
              sx={{
                borderRadius: 1,
              }}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-haspopup="true"
              color="inherit"
              sx={{
                borderRadius: 1,
              }}
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
      </AppBar>
    </Box>
  );
}
export default NavAppBar