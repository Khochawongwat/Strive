import { Box, Toolbar, IconButton, Typography, AppBar, Badge } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { AccountCircle, TimerOutlined, WaterDropOutlined } from "@mui/icons-material";
interface Props {

}

const NavAppBar: React.FC<Props> = ({ }) => {
  return (
    <Box sx={{ flexGrow: 1, userSelect: 'none', bgcolor: 'transparent'}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Strive
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex'}}}>

            <IconButton size="large" aria-label="show 4 new mails" color="inherit" sx={{
              borderRadius: 1,
            }}>
              <Badge badgeContent={1} color="primary">
                <TimerOutlined />
              </Badge>
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex'}}}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{
                borderRadius: 1,
                display: 'flex',
                gap: '.2rem',
                width: '4rem',
                fontSize: '15px',
              }}
            >
              <WaterDropOutlined />
              {0}
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
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
              aria-label="account of current user"
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