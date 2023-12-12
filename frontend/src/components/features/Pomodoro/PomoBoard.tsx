import { useEffect, useState } from "react";
import { Grid, Button, Box, Typography } from "@mui/material";
import { myPalette } from "../../../theme";
import Pomo from "../../../schema/Pomo.schema";

const PomoBoard = () => {
  const [selectedTask, setSelectedTask] = useState(0);
  const [pomoSession, setPomoSession] = useState<Pomo | null>(null);
  const tasks = ["Select a task", "Set a timer", "Take a break"];
  const [remainingTime, setRemainingTime] = useState<number>(0)

  useEffect(() => {
    const savedPomo = localStorage.getItem("pomodoro")
    if (savedPomo && savedPomo.length > 0) {
      const pomo = new Pomo(JSON.parse(savedPomo))
      pomo.setCallbacks({
        onTick: (time: number) => setRemainingTime(time),
        onStart: () => console.log('Pomo session started!'),
        onPause: () => console.log('Pomo session paused!'),
        onReset: () => console.log('Pomo session reset!'),
        onComplete: () => console.log('Pomo session completed!'),
      });

      setPomoSession(pomo);

      return () => {
        if (pomoSession) {
          pomoSession.reset()
          pomoSession.start()
        };
      };
    }
  }, []);

  const startPomoSession = () => {
    const newPomoSession = new Pomo();
    setPomoSession(newPomoSession);
    localStorage.setItem("pomodoro", JSON.stringify(newPomoSession));
  };

  const handleStop = () => {
    localStorage.removeItem("pomodoro");
    setPomoSession(null);
    console.log("Removed");
  };


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
          {pomoSession ? <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button>Pomodoro</Button>
            <Button>Short Break</Button>
            <Button>Long Break</Button>
          </Box> : null}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {pomoSession ? (
              <>
                <Typography sx={{ fontSize: '6rem' }}>
                  25:00
                </Typography>
              </>
            ) : null}
            <Button onClick={startPomoSession}>Start</Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PomoBoard;
