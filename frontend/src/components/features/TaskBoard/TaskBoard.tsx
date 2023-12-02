import { Box, Button, Grid, IconButton, Typography } from "@mui/material"
import TaskContainer from "./TaskColumnContainer";
import { Task, TaskClass } from "../../../schema/Task.schema";
import TaskSearchBar from "./TaskSearchBar";
import { useState } from "react";
import { MoreHorizOutlined } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import TaskCreationDialog from "../../commons/Dialogs/TaskCreationDialog";

interface Props {
}

const TaskBoard: React.FC<Props> = ({ }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const todoList = [new TaskClass({ title: 'Jamie, pull up a video of a bear driving a rocket.', tags: ['Homework', 'Programming'] } as Task)];
    const progressList = [new TaskClass({ title: 'Pulling up a video of a bear taking TMC.', tags: ['Homework', 'TMC'], dueDate: new Date() } as Task)]
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleCreate = () => {
        setDialogOpen(true); // Open the dialog when the "Create" button is clicked
    };

    const handleCloseDialog = () => {
        setDialogOpen(false); // Close the dialog when needed
    };

    return (
        <Box display='flex' flexDirection="column" gap={3}>
            <Box display='flex' flexDirection="row" justifyContent="space-between">
                <Typography variant="h4">Board</Typography>
                <Box>
                    <Button sx={{ background: blue[400], color: 'black' }} onClick={handleCreate}>
                        Create
                    </Button>
                    <IconButton>
                        <MoreHorizOutlined />
                    </IconButton>
                </Box>
            </Box>
            <TaskSearchBar setSearchQuery={setSearchQuery} />
            <Grid container spacing={2}>
                {/* To Do */}
                <TaskContainer title={"TO DO"} list={todoList} />

                {/* In Progress */}
                <TaskContainer title={"IN PROGRESS"} list={progressList} />

                {/* On Hold */}
                <TaskContainer title={"ON HOLD"} list={[]} />

                {/* Completed */}
                <TaskContainer title={"COMPLETED"} list={todoList} />
            </Grid>
            <TaskCreationDialog handleClose={handleCloseDialog} open={dialogOpen} />

        </Box>
    );
};

export default TaskBoard;