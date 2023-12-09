import { Box, Grid, Paper, Typography } from "@mui/material"
import { myPalette } from "../../../theme";
const PomoBoard = () => {
    const gradients = [
        "linear-gradient(to bottom right, #FFD700, #FF6347)", // Gold to Tomato
        "linear-gradient(to bottom right, #00BFFF, #8A2BE2)", // Deep Sky Blue to Blue Violet
        "linear-gradient(to bottom right, #4169E1, #FF1493)"  // Royal Blue to Deep Pink
    ];
    return (
        <Grid sx={{ flexGrow: 1, bgcolor: myPalette[951], borderRadius: '8px', mb: '32px' }} container spacing={2}>
            <Grid item xs={12} >
                <Grid container justifyContent="space-between" p="32px">
                    <Grid item>
                        <Paper
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: "12rem",
                                aspectRatio: 1 / 1.4,
                                background: gradients[0],
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            Select a task
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: "12rem",
                            aspectRatio: 1 / 1.4,
                            background: gradients[1],
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: myPalette[50],
                                borderRadius: "8px",
                            }}>
                                <Typography>
                                    Start Timer
                                </Typography>
                            </Box>

                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: "12rem",
                                aspectRatio: 1 / 1.4,
                                background: gradients[2],
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            Take a break!
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default PomoBoard