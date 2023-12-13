import { useEffect, useState } from "react";
import { Grid, Button, Box, Typography, IconButton } from "@mui/material";
import { myPalette } from "../../../theme";
import { MoreHorizOutlined, Pause, PlayArrow, Replay } from "@mui/icons-material";
import { formatTime } from "../../../utils/helper";
import Timer from "../../../schema/Timer.schema";

interface Props {
  timerState: {
    timer: number,
    timerIsRunning: boolean
  }
}

const PomoBoard: React.FC<Props> = ({ timerState }) => {
  const [selectedTask, setSelectedTask] = useState(0);
  const [timerSession, setTimerSession] = useState<Timer | null>(null);

  useEffect(() => {

  }, [])

  return (
    <Grid
      sx={{
        flexGrow: 1,
        bgcolor: myPalette[951],
        borderRadius: "8px",
        mb: "32px",
      }}
      container
      spacing={2}
    >
      <Grid item xs={12} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
        <Box display="flex" justifyContent="center" flexDirection="column" px="32px" py="16px">
          {timerSession ? <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: '12px' }}>
              <Button disabled={selectedTask === 0 ? true : false} sx={{ px: '32px', bgcolor: selectedTask === 0 ? myPalette[950] : myPalette[400], color: myPalette[50] }}>Pomodoro</Button>
              <Button disabled={selectedTask === 1 ? true : false} sx={{ px: '32px', bgcolor: selectedTask === 1 ? myPalette[950] : myPalette[400], color: myPalette[50] }}>Short Break</Button>
              <Button disabled={selectedTask === 2 ? true : false} sx={{ px: '32px', bgcolor: selectedTask === 2 ? myPalette[950] : myPalette[400], color: myPalette[50] }}>Long Break</Button>
            </Box>
          </Box> : null}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {timerSession ? (
              <>
                <Typography sx={{ fontSize: '6rem' }}>
                  {formatTime(timerState.timer)}
                </Typography>
              </>
            ) : null}
            <Grid item sx={{ display: 'flex', gap: '12px' }}>
              <IconButton>
                <Replay />
              </IconButton>
              {timerState.timerIsRunning ? <IconButton>
                <Pause />
              </IconButton> : <IconButton>
                <PlayArrow />
              </IconButton>
              }
              <IconButton>
                <MoreHorizOutlined />
              </IconButton>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PomoBoard;
