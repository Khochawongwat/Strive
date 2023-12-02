import { Box, Typography } from "@mui/material"
import { grey, orange, red } from "@mui/material/colors"
import { TaskClass } from "../../../schema/Task.schema"

interface Props {
    index: number
    task: TaskClass
}

const TaskItem: React.FC<Props> = ({ task, index }) => {
    return (
        <Box key={index} sx={{ my: 1, borderRadius: '4px', background: grey[300], p: '12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography fontSize="12px" color={grey[900]} fontWeight="500">{task.title}</Typography>
            <Box display="flex" flexDirection="column" gap={1}>
                {task.tags ? task.tags.map((tag, index) => (
                    <Typography key={index} fontSize="10px" bgcolor={orange[500]} fontWeight="800" color={grey[800]} width="fit-content" borderRadius="4px" py='.25px' px='2px'>{tag.toUpperCase()}</Typography>
                )) : 
                <Typography>Woohoo no work!</Typography>
                }
            </Box>
            <Typography fontSize="12px" color={task.dueDate ? red[400] : grey[500]} fontWeight="500">{task.dueDate ? task.dueDate?.toISOString().split('T')[0] : "NO DEADLINE"}</Typography>
        </Box>
    )
}

export default TaskItem