import { Grid, Paper, Typography, Box } from "@mui/material"
import { grey} from "@mui/material/colors"
import { TaskClass } from "../../../schema/Task.schema"
import TaskItem from "./TaskItem"

interface Props {
    list: TaskClass[]
    title: String
}

const TaskColumnContainer: React.FC<Props> = ({ list, title }) => {
    return (
        <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ background: grey[500], p: 1, borderRadius: '4px', height: `fit-content` }}>
                <Box sx = {{display:  'flex', flexDirection: 'row', gap: 1}}>
                <Typography fontSize="12px" color={grey[900]} fontWeight="700">{title.toUpperCase()}</Typography>
                <Typography fontSize="12px" color={grey[900]}>{list.length}</Typography>
                </Box>
                {list.map((task, index) => (
                    <TaskItem task={task} index = {index}/>
                ))}
            </Paper>
        </Grid>
    )
}

export default TaskColumnContainer