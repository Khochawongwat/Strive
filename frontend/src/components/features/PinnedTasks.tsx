import { Box, Grid, IconButton, Typography } from "@mui/material";
import { Task, TaskClass } from "../../schema/Task.schema";
import { blue, grey, orange } from "@mui/material/colors";
import { Assignment, CheckCircleOutlineOutlined, TaskOutlined } from "@mui/icons-material";

const PinnedTasks = () => {
    const pinnedTaskData: Task[] = [
        { type: 'Homework', title: 'Task 1', description: 'Fireflow, an open-source Learning Management System (LMS) package built on Scala and Typescript, represents a dynamic and innovative platform designed to facilitate consistent, efficient, and custo…', status: 'completed' },
        { type: 'Type2', title: 'Task 2', description: 'Description of Task 2', status: 'on hold' },
        { type: 'Type2', title: 'Task 2', description: 'Description of Task 2', status: 'working on it' },
        { type: 'Type2', title: 'Task 2', description: 'Description of Task 2', status: 'completed' },
    ];

    const pinnedTasks = pinnedTaskData.map((taskData) => new TaskClass(taskData));

    return (
        <Grid>
            <Box sx={{ display: 'flex', alignItems: 'baseline', flexDirection: 'row', gap: '12px', my: '8px' }}>
                <Typography>
                    Pinned Tasks
                </Typography>
                <Typography fontSize={'12px'} color={blue[400]}>
                    Customize
                </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '4px',
            }}>
                {pinnedTasks.map((task, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 'calc(50% - 2px)',
                            border: "1px solid" + grey[600],
                            borderRadius: '8px',
                            p: '1rem',
                            height: 'calc(50%)px',
                            boxSizing: "border-box",
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 2
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'baseline',
                                gap: 1,
                                justifyContent: 'space-between'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <TaskOutlined sx={{ color: blue[400] }} />
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'baseline',
                                        gap: 1
                                    }}>
                                        <Typography color={blue[400]} fontSize={'14px'}>{task.title}</Typography>
                                    </Box>
                                </Box>
                                {task.status !== "completed" && (
                                    <IconButton style={{ padding: '0' }}>
                                        <CheckCircleOutlineOutlined scale="small" />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography color={grey[600]} fontSize={'12px'}>{task.description}</Typography>
                            <Typography color={grey[600]} fontSize={'12px'}>{task.tags}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{
                                display: 'flex',
                                p: '3px',
                                width: 'fit-content',
                                gap: '3px',
                                bgcolor: orange[500],
                                borderRadius: '4px'
                            }}>
                                <Assignment style={{ fontSize: '16px' }} />
                                <Typography fontSize='12px'>{task.status.toUpperCase()}</Typography>
                            </Box>
                            <Typography color={grey[600]} fontSize={'12px'}>{task.type}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box>

            </Box>
        </Grid>
    );
};

export default PinnedTasks;