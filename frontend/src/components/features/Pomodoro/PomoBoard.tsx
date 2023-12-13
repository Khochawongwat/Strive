import { useEffect, useState } from "react";
import { Grid, Button, Box, Typography, IconButton } from "@mui/material";
import { myPalette } from "../../../theme";
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, MoreHorizOutlined, Pause, PlayArrow, Replay, SkipNextOutlined, SkipPreviousOutlined, StopCircleOutlined, TimerOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { formatTime } from "../../../utils/helper";
import Timer from "../../../schema/Timer.schema";

interface Props {
  timer: Timer
  timeStates: {
    time: number
    running: boolean
    status: number
    done: boolean
  }
}

const PomoBoard: React.FC<Props> = ({ timer, timeStates }) => {
  const [selectedTask, setSelectedTask] = useState(timeStates.status);
  const [hidden, setHidden] = useState(false)
  const [blink, setBlink] = useState(false);

  const handleTaskSelection = (index: number) => {
    if (index >= 0 && index <= 2) {
      setSelectedTask(index);
      timer.changeStatus(index as 0 | 1 | 2);
    }
  };

  useEffect(()=>{
    setSelectedTask(timeStates.status)
  }, [timeStates])
  
  useEffect(() => {
    let blinkInterval: NodeJS.Timeout | undefined;

    if (hidden && timeStates.running) {
      blinkInterval = setInterval(() => {
        setBlink((prevBlink) => !prevBlink);
      }, 1000);
    }

    return () => clearInterval(blinkInterval);
  }, [hidden, timeStates.running]);

  const startTimer = () => {
    timer.start();
  };

  const addTime = () => {
    timer.addOneMinute();
  }
  const removeTime = () => {
    timer.removeOneMinute();
  }

  const resetTimer = () => {
    timer.reset();
  };

  const pauseTimer = () => {
    timer.pause();
  };


  return (
    <Grid
      sx={{
        flexGrow: 1,
        bgcolor: myPalette[951],
        borderRadius: "8px",
        mb: "32px",
        position: 'relative',
        overflow: 'visible',
      }}
      container
      spacing={2}
    >
      <IconButton
        disableRipple
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          p: 0,
          mx: '12px',
          my: '8px',

        }}
        onClick={() => setHidden(!hidden)}
      >
        {hidden ? <VisibilityOff sx={{ color: myPalette[400], opacity: .75 }} /> : <Visibility sx={{ color: myPalette[952] }} />}
      </IconButton>
      <Grid item xs={12} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
        {!hidden ? <Box display="flex" justifyContent="center" flexDirection="column" px="32px" py="16px">
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                disabled={selectedTask === 0 ? true : false}
                onClick={() => handleTaskSelection(0)}
                sx={{
                  height: '2.5rem',
                  bgcolor: selectedTask === 0 ? myPalette[950] : myPalette[400],
                  color: myPalette[50],
                }}
              >
                Pomodoro
              </Button>
              <Button
                disabled={selectedTask === 1 ? true : false}
                onClick={() => handleTaskSelection(1)}
                sx={{
                  height: '2.5rem',
                  bgcolor: selectedTask === 1 ? myPalette[950] : myPalette[400],
                  color: myPalette[50],
                }}
              >
                Short Break
              </Button>
              <Button
                disabled={selectedTask === 2 ? true : false}
                onClick={() => handleTaskSelection(2)}
                sx={{
                  height: '2.5rem',
                  bgcolor: selectedTask === 2 ? myPalette[950] : myPalette[400],
                  color: myPalette[50],
                }}
              >
                Long Break
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '6rem' }}>
              {formatTime(timeStates.time)}
            </Typography>
            <Grid item sx={{ display: 'flex', gap: '12px' }}>
              <IconButton onClick={resetTimer}>
                <Replay />
              </IconButton>
              <IconButton onClick={removeTime}>
                <KeyboardDoubleArrowLeft />
              </IconButton>
              {
                timeStates.done ? (
                  <IconButton>
                    <StopCircleOutlined />
                  </IconButton>
                ) : (
                  timeStates.running ? (
                    <IconButton onClick={pauseTimer}>
                      <Pause />
                    </IconButton>
                  ) : (
                    <IconButton onClick={startTimer}>
                      <PlayArrow />
                    </IconButton>
                  )
                )
              }
              <IconButton onClick={addTime}>
                <KeyboardDoubleArrowRight />
              </IconButton>
              <IconButton>
                <MoreHorizOutlined />
              </IconButton>
            </Grid>
          </Box>
        </Box> : <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'start', height: '2rem' }}>
          <IconButton disableRipple sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => {
            if (timeStates.running) {
              pauseTimer()
            } else {
              startTimer()
            }
          }}>
            <TimerOutlined sx={{ color: timeStates.running ? myPalette[400] : myPalette[200], opacity: blink && timeStates.running ? 0.5 : 1, transition: 'opacity .5s' }} />
          </IconButton>
        </Box>}
      </Grid>
    </Grid>
  );
};

export default PomoBoard;
