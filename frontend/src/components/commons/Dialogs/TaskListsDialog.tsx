import { CloseOutlined, AlarmOutlined } from "@mui/icons-material"
import { Dialog, DialogTitle, IconButton, DialogContent, Box, Typography, DialogContentText, Switch, DialogActions, Button } from "@mui/material"

interface Props {
    handleClose: () => void
    open: boolean
}

const TaskListsDialog: React.FC<Props> = ({ handleClose, open }) => {
    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle sx={{ m: 0 }}>
                Tasks
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
            <DialogContent dividers sx={{
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
    )
}

export default TaskListsDialog