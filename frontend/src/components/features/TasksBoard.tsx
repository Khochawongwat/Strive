import { Box, Grid, Paper, Typography } from "@mui/material"
import { grey, orange } from "@mui/material/colors";

const TasksBoard: React.FC = () => {
    // Sample tasks
    const todoList = ["Engage Jupiter Express for outer solar system travel", "Task 2", "Task 3", "Task 4"];
    const inprogressList = ["Task 5", "Task 6", "Task 7", "Task 8", "Task 9", "Task 10"];
    const onholdList = ["Task 11", "Task 12"];
    const completedList = ["Task 13", "Task 14", "Task 15"];

    const longestList = Math.max(
        todoList.length,
        inprogressList.length,
        onholdList.length,
        completedList.length
    );

    return (
        <Grid container spacing={2}>

            {/* To Do */}
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ background: grey[500], p: 1, borderRadius: '4px', height: `${longestList * 3}rem` }}>
                    <Typography fontSize="12px" color = {grey[900]} fontWeight="700">TO DO  {todoList.length}</Typography>
                    {todoList.map((task, index) => (
                        <Box key={index} sx={{ my: 1, borderRadius: '4px', background: grey[300], p: '12px', display: 'flex', flexDirection: 'column', gap: 3}}>
                            <Typography fontSize="12px" color = {grey[900]} fontWeight="500">{task}</Typography>
                            <Typography fontSize="10px" bgcolor={orange[500]} fontWeight="800" color = {grey[800]} width="fit-content" borderRadius="4px" py = '.25px' px = '2px'>{"Homework".toUpperCase()}</Typography>
                        </Box>
                    ))}
                </Paper>
            </Grid>

            {/* In Progress */}
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ background: grey[800], p: 2, borderRadius: '8px', height: `${longestList * 3}rem` }}>
                    <Typography fontSize="12px" fontWeight="700">IN PROGRESS {inprogressList.length}</Typography>
                    {inprogressList.map((task, index) => (
                        <Box key={index} sx={{ my: 1 }}>
                            <Typography>{task}</Typography>
                        </Box>
                    ))}
                </Paper>
            </Grid>

            {/* On Hold */}
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ background: grey[800], p: 2, borderRadius: '8px', height: `${longestList * 3}rem` }}>
                    <Typography fontSize="12px" fontWeight="700">ON HOLD {onholdList.length}</Typography>
                    {onholdList.map((task, index) => (
                        <Box key={index} sx={{ my: 1 }}>
                            <Typography>{task}</Typography>
                        </Box>
                    ))}
                </Paper>
            </Grid>

            {/* Completed */}
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ background: grey[800], p: 2, borderRadius: '8px', height: `${longestList * 3}rem` }}>
                    <Typography fontSize="12px" fontWeight="700">COMPLETED {completedList.length}</Typography>
                    {completedList.map((task, index) => (
                        <Box key={index} sx={{ my: 1 }}>
                            <Typography>{task}</Typography>
                        </Box>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default TasksBoard;