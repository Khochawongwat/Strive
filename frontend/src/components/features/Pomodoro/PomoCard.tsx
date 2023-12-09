import { Grid, Paper, Typography, Card } from "@mui/material"
import { myPalette } from "../../../theme"

interface Props {
    style: any
    task: any
}

const PomoCard: React.FC<Props> = ({ style, task }) => {
    return (<Grid item>
        <Paper sx={style}>
            <Typography>{task}</Typography>
        </Paper>
    </Grid>)
}

export default PomoCard