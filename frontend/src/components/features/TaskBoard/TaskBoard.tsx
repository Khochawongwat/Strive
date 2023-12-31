import { Box, Button, Grid, Typography } from "@mui/material"
import TaskContainer from "./TaskColumnContainer";
import { Task, TaskClass } from "../../../schema/Task.schema";
import { useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";
import TaskCreationDialog from "../../commons/Dialogs/TaskCreationDialog";
import { myPalette, priorityPalette } from "../../../theme";
import axios from "axios";
import { TASKS_ENDPOINTS } from "../../../utils/endpoints";
import { getAuth } from "@firebase/auth";
import { firebaseApp } from "../../../apps/firebase.app";
import { useDrop } from "react-dnd";

interface Props {
}

interface ColumnHiddenStates {
    todo: boolean,
    progress: boolean,
    onHold: boolean,
    completed: boolean
}

const TaskBoard: React.FC<Props> = ({ }) => {
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
    const [anItemIsDragging, setAnItemIsDragging] = useState(false)

    const handleCreate = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleAddTask = (newTask: TaskClass) => {
        try {
            switch (newTask.status) {
                case 0:
                    setTodoList((prevTodoList) => [...prevTodoList, newTask].sort((a, b) => b.priority - a.priority));
                    break;
                case 1:
                    setProgressList((prevProgressList) => [...prevProgressList, newTask].sort((a, b) => b.priority - a.priority));
                    break;
                case 2:
                    setOnHoldList((prevOnHoldList) => [...prevOnHoldList, newTask].sort((a, b) => b.priority - a.priority));
                    break;
                case 3:
                    setCompletedList((prevCompletedList) => [...prevCompletedList, newTask].sort((a, b) => b.priority - a.priority));
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("Error adding task:", error);
            throw new Error(error as string)
        }
    };

    const handleRemoveTask = (task: TaskClass) => {
        try {
            switch (task.status) {
                case 0:
                    setTodoList((prevTodoList) => prevTodoList.filter((t) => t._id !== task._id));
                    break;
                case 1:
                    setProgressList((prevProgressList) => prevProgressList.filter((t) => t._id !== task._id));
                    break;
                case 2:
                    setOnHoldList((prevOnHoldList) => prevOnHoldList.filter((t) => t._id !== task._id));
                    break;
                case 3:
                    setCompletedList((prevCompletedList) => prevCompletedList.filter((t) => t._id !== task._id));
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("Error removing task:", error);
            throw new Error(error as string);
        }
    };

    const removeTaskFromServer = async (task: TaskClass) => {
        try {
            await axios.delete(`${TASKS_ENDPOINTS.tasks}/${task._id}`)
            handleRemoveTask(task)
        } catch (error) {
            console.error(`Failed to delete task: ${error}`);
        }
    }

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

                const todoList = tasks.filter((task: Task) => task.status === 0).map((task: Task) => new TaskClass(task));
                todoList.sort((a: TaskClass, b: TaskClass) => b.priority - a.priority); // sort by priority

                const progressList = tasks.filter((task: Task) => task.status === 1).map((task: Task) => new TaskClass(task));
                progressList.sort((a: TaskClass, b: TaskClass) => b.priority - a.priority); // sort by priority

                const onHoldList = tasks.filter((task: Task) => task.status === 2).map((task: Task) => new TaskClass(task));
                onHoldList.sort((a: TaskClass, b: TaskClass) => b.priority - a.priority); // sort by priority

                const completedList = tasks.filter((task: Task) => task.status === 3).map((task: Task) => new TaskClass(task));
                completedList.sort((a: TaskClass, b: TaskClass) => b.priority - a.priority);
                setTodoList(todoList);
                setProgressList(progressList);
                setOnHoldList(onHoldList);
                setCompletedList(completedList);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const [, drop] = useDrop({
        accept: 'TASK_ITEM',
        drop: async (item: { task: TaskClass, preStatus: number }) => {
            const { task: droppedTask } = item;
            await removeTaskFromServer(droppedTask)
            setAnItemIsDragging(false)
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    useEffect(() => {
        fetchTasks()
    }, [])

    return (
        <Box display='flex' flexDirection="column" gap={3}>

            <Delete
                ref={drop}
                sx={{
                    color: priorityPalette[4],
                    visibility: 'visible',
                    position: 'fixed',
                    bottom: anItemIsDragging ? 0 : '-100%',
                    left: '50%',
                    fontSize: '10rem',
                    zIndex: 9999,
                    transition: 'bottom 0.2s ease-in-out',
                    transform: 'translateX(-50%)',
                }}
            />

            <Box display='flex' flexDirection="row" alignItems='center' justifyContent="space-between">
                <Box display='flex' flexDirection="row" alignItems='center'>
                    <Typography variant="h4">Board</Typography>
                </Box>
                <Box>
                    <Button sx={{ background: myPalette[400], color: myPalette[50] }} onClick={handleCreate}>
                        Create
                    </Button>
                </Box>

            </Box>
            <Grid container spacing={2}>
                {/* To Do */}
                <TaskContainer setAnItemIsDragging={setAnItemIsDragging} handleRemoveTask={handleRemoveTask} loading={loading} updateDeletedTaskLists={updateDeletedTaskLists} id="todo" handleAddTask={handleAddTask} hidden={hiddenStates['todo']} handleHiddenStates={handleHiddenStates} title={"TO DO"} list={todoList} preStatus={0} />

                {/* In Progress */}
                <TaskContainer setAnItemIsDragging={setAnItemIsDragging} handleRemoveTask={handleRemoveTask} loading={loading} updateDeletedTaskLists={updateDeletedTaskLists} id="progress" handleAddTask={handleAddTask} hidden={hiddenStates['progress']} handleHiddenStates={handleHiddenStates} title={"IN PROGRESS"} list={progressList} preStatus={1} />

                {/* On Hold */}
                <TaskContainer setAnItemIsDragging={setAnItemIsDragging} handleRemoveTask={handleRemoveTask} loading={loading} updateDeletedTaskLists={updateDeletedTaskLists} id="onHold" handleAddTask={handleAddTask} hidden={hiddenStates['onHold']} handleHiddenStates={handleHiddenStates} title={"ON HOLD"} list={onHoldList} preStatus={2} />

                {/* Completed */}
                <TaskContainer setAnItemIsDragging={setAnItemIsDragging} handleRemoveTask={handleRemoveTask} loading={loading} updateDeletedTaskLists={updateDeletedTaskLists} id="completed" handleAddTask={handleAddTask} hidden={hiddenStates['completed']} handleHiddenStates={handleHiddenStates} title={" COMPLETED"} list={completedList} preStatus={3} />
            </Grid>
            <TaskCreationDialog handleClose={handleCloseDialog} open={dialogOpen} updateTaskLists={handleAddTask} />
        </Box>
    );
};

export default TaskBoard;