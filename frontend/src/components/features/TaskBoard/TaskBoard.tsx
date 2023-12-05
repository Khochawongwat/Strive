import { Box, Button, Grid, IconButton, Typography } from "@mui/material"
import TaskContainer from "./TaskColumnContainer";
import { Task, TaskClass } from "../../../schema/Task.schema";
import TaskSearchBar from "./TaskSearchBar";
import { useEffect, useRef, useState } from "react";
import { MoreHorizOutlined } from "@mui/icons-material";
import TaskCreationDialog from "../../commons/Dialogs/TaskCreationDialog";
import { myPalette } from "../../../theme";
import axios from "axios";
import { TASKS_ENDPOINTS } from "../../../utils/endpoints";
import { getAuth } from "@firebase/auth";
import { firebaseApp } from "../../../apps/firebase.app";

interface Props {
}

interface ColumnHiddenStates {
    todo: boolean,
    progress: boolean,
    onHold: boolean,
    completed: boolean
}

const TaskBoard: React.FC<Props> = ({ }) => {
    const [_, setSearchQuery] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [todoList, setTodoList] = useState<TaskClass[]>([]);
    const [progressList, setProgressList] = useState<TaskClass[]>([]);
    const [onHoldList, setOnHoldList] = useState<TaskClass[]>([]);
    const [completedList, setCompletedList] = useState<TaskClass[]>([]);
    const [hiddenStates, setHiddenStates] = useState<ColumnHiddenStates>(() => {
        try {
            const storedHiddenStates = localStorage.getItem('HiddenStates');

            return storedHiddenStates ? JSON.parse(storedHiddenStates) : {
                todo: false,
                progress: false,
                onHold: false,
                completed: false,
            };
        } catch (error) {
            console.error('Error while parsing hidden states from localStorage:', error);
            return {
                todo: false,
                progress: false,
                onHold: false,
                completed: false,
            };
        }
    });
    const [loading, setLoading] = useState(false)

    const handleCreate = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const updateTaskLists = (newTask: TaskClass) => {
        if (newTask.status === 0) {
            setTodoList((prevTodoList) => [...prevTodoList, newTask]);
        } else if (newTask.status === 1) {
            setProgressList((prevProgressList) => [...prevProgressList, newTask]);
        } else if (newTask.status === 2) {
            setOnHoldList((prevOnHoldList) => [...prevOnHoldList, newTask]);
        } else if (newTask.status === 3) {
            setCompletedList((prevCompletedList) => [...prevCompletedList, newTask]);
        }
    };

    const updateDeletedTaskLists = (status: number) => {
        if (status === 0) {
            setTodoList([])
        } else if (status === 1) {
            setProgressList([])
        } else if (status === 2) {
            setOnHoldList([])
        } else {
            setCompletedList([])
        }
    }

    const handleHiddenStates = (preStatus: number) => {
        if (preStatus > 3 || preStatus < 0) {
            return;
        }

        const strStatus = preStatus.toString();

        switch (strStatus) {
            case '0':
                setHiddenStates((prevStates) => {
                    const updatedState = {
                        ...prevStates,
                        todo: !prevStates.todo,
                    };
                    localStorage.setItem("HiddenStates", JSON.stringify(updatedState));
                    return updatedState;
                });
                break;
            case '1':
                setHiddenStates((prevStates) => {
                    const updatedState = {
                        ...prevStates,
                        progress: !prevStates.progress,
                    };
                    localStorage.setItem("HiddenStates", JSON.stringify(updatedState));
                    return updatedState;
                });
                break;
            case '2':
                setHiddenStates((prevStates) => {
                    const updatedState = {
                        ...prevStates,
                        onHold: !prevStates.onHold,
                    };
                    localStorage.setItem("HiddenStates", JSON.stringify(updatedState));
                    return updatedState;
                });
                break;
            case '3':
                setHiddenStates((prevStates) => {
                    const updatedState = {
                        ...prevStates,
                        completed: !prevStates.completed,
                    };
                    localStorage.setItem("HiddenStates", JSON.stringify(updatedState));
                    return updatedState;
                });
                break;
            default:
                break;
        }
    };

    const fetchTasks = async () => {
        const user = getAuth(firebaseApp).currentUser
        setLoading(true)
        try {
            if (user) {
                const response = await axios.get(`${TASKS_ENDPOINTS.tasks}/${user.uid}`);
                const tasks = response.data;

                const todoList = tasks.filter((task: Task) => task.status === 0);
                const progressList = tasks.filter((task: Task) => task.status === 1);
                const onHoldList = tasks.filter((task: Task) => task.status === 2);
                const completedList = tasks.filter((task: Task) => task.status === 3);

                setTodoList(todoList);
                setProgressList(progressList);
                setOnHoldList(onHoldList);
                setCompletedList(completedList);
                console.log("Fetched")
            } else {
                console.log("User is not found")
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    return (
        <Box display='flex' flexDirection="column" gap={3}>
            <Box display='flex' flexDirection="row" justifyContent="space-between">
                <Typography variant="h4">Board</Typography>
                <Box>
                    <Button sx={{ background: myPalette[400], color: myPalette[50] }} onClick={handleCreate}>
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
                <TaskContainer loading={loading} updateDeletedTaskLists={updateDeletedTaskLists} id="todo" updateTaskLists={updateTaskLists} hidden={hiddenStates['todo']} handleHiddenStates={handleHiddenStates} title={"TO DO"} list={todoList} preStatus={0} />

                {/* In Progress */}
                <TaskContainer loading={loading} updateDeletedTaskLists={updateDeletedTaskLists} id="progress" updateTaskLists={updateTaskLists} hidden={hiddenStates['progress']} handleHiddenStates={handleHiddenStates} title={"IN PROGRESS"} list={progressList} preStatus={1} />

                {/* On Hold */}
                <TaskContainer loading={loading} updateDeletedTaskLists={updateDeletedTaskLists} id="onHold" updateTaskLists={updateTaskLists} hidden={hiddenStates['onHold']} handleHiddenStates={handleHiddenStates} title={"ON HOLD"} list={onHoldList} preStatus={2} />

                {/* Completed */}
                <TaskContainer loading={loading} updateDeletedTaskLists={updateDeletedTaskLists} id="completed" updateTaskLists={updateTaskLists} hidden={hiddenStates['completed']} handleHiddenStates={handleHiddenStates} title={" COMPLETED"} list={completedList} preStatus={3} />
            </Grid>
            <TaskCreationDialog handleClose={handleCloseDialog} open={dialogOpen} updateTaskLists={updateTaskLists} />
        </Box>
    );
};

export default TaskBoard;