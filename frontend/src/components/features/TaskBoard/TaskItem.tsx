import { Box, Card, Typography } from "@mui/material";
import { myPalette } from '../../../theme';
import { DragIndicatorOutlined } from "@mui/icons-material";
import { useState } from "react";
import TaskInfoDialog from "../../commons/Dialogs/TaskInfoDialog";
import { useSpring, animated } from 'react-spring';
import { TaskClass } from "../../../schema/Task.schema";
import TaskTagsComponent from "./TaskTagsComponent";

interface Props {
    task: TaskClass;
}

const TaskItem: React.FC<Props> = ({ task }) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDoubleClick = () => {
        handleOpenDialog();
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const slideAnimation = useSpring({
        transform: dialogOpen ? 'translateY(-12.5%)' : 'translateY(0%)',
    });

    return (
        <animated.div style={slideAnimation}>
            <Card
                onDoubleClick={handleDoubleClick}
                sx={{
                    border: `1px solid ${dialogOpen ? myPalette[50] : 'transparent'}`,
                    my: 1,
                    borderRadius: '4px',
                    background: myPalette[952],
                    py: '12px',
                    pl: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    cursor: 'pointer'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    mr: '4px',

                }}>
                    <Typography
                        fontSize="12px"
                        color={myPalette[50]}
                        fontWeight="500"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 5,
                            minHeight: '3em',
                            maxHeight: '6em',
                            wordWrap: 'break-word'
                        }}
                    >
                        {task.description}
                    </Typography>
                    <DragIndicatorOutlined sx={{ fontSize: '18px', color: myPalette[975] }} />
                </Box>
                <TaskTagsComponent tags = {task.tags}/>
                <TaskInfoDialog handleClose={handleCloseDialog} open={dialogOpen} task={task} />
            </Card>
        </animated.div>
    );
};

export default TaskItem;