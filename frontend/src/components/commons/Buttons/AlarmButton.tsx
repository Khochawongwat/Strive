import { AlarmOutlined, CloseOutlined } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Switch, ToggleButton, Typography, styled } from "@mui/material"
import { grey } from "@mui/material/colors";
import React from "react";

const AlarmButton: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setTimeout(() => {
        }, 1000)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box >
            <IconButton
                aria-haspopup="true"
                onClick={handleClick}
                sx={{
                    borderRadius: 2,
                    justifyContent: open ? 'start' : 'center',
                    width: open ? '6rem' : 'fit-content',
                    background: open ? grey[800] : '',
                    transition: '2s width, .5s background ease-in-out'
                }}
            >
                <AlarmOutlined />
            </IconButton>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle sx={{ m: 0 }}>
                    Settings
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    disableRipple
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        "hover": {}
                    }}
                >
                    <CloseOutlined />
                </IconButton>
                <DialogContent dividers sx = {{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.5rem',
                }}>
                    <Box sx={{
                        display: 'flex',
                        gap: '.5rem',
                        flexDirection: 'row',
                        alignContent: 'center',
                        alignItems: 'center',

                    }}>
                        <AlarmOutlined />
                        <Typography fontWeight={600}>
                            TIMER
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}>
                        <DialogContentText>
                            Auto Start Breaks
                        </DialogContentText>

                        <Switch defaultChecked />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}>
                        <DialogContentText>
                            Auto Start Breaks
                        </DialogContentText>

                        <Switch defaultChecked />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}>
                        <DialogContentText>
                            Auto Start Breaks
                        </DialogContentText>

                        <Switch defaultChecked />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default AlarmButton