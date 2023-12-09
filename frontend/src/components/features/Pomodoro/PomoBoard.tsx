import { useEffect, useState } from "react";
import { Grid, IconButton, Button, Typography } from "@mui/material";
import { ArrowBackIosNewOutlined, ArrowForwardIosOutlined } from "@mui/icons-material";
import { myPalette } from "../../../theme";
import PomoCard from "./PomoCard";
import Pomo from "../../../schema/Pomo.schema";

const PaperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "12rem",
  mx: '.5rem',
  aspectRatio: 1 / 0.9,
  background: myPalette[400],
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const PreviousPaperStyle = {
  opacity: 0.4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "8rem",
  aspectRatio: 1 / 0.9,
  background: myPalette[400],
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const PomoBoard = () => {
  const [selectedTask, setSelectedTask] = useState(0);
  const [pomoSession, setPomoSession] = useState<Pomo | null>(null);
  const tasks = ["Select a task", "Set a timer", "Take a break"];
  const [remainingTime, setRemainingTime] = useState<number>(0)

  useEffect(() => {
    // Create a Pomo instance with a session duration of 25 minutes
    const pomo = new Pomo(25);

    // Set callbacks to update UI
    pomo.setCallbacks({
      onTick: (time) => setRemainingTime(time),
      onStart: () => console.log('Pomo session started!'),
      onPause: () => console.log('Pomo session paused!'),
      onReset: () => console.log('Pomo session reset!'),
      onComplete: () => console.log('Pomo session completed!'),
    });

    setPomoSession(pomo);

    // Cleanup when the component unmounts
    return () => {
      if (pomoSession) pomoSession.reset();
    };
  }, []); // Run this effect only once on mount
  useEffect(() => {
    const session = localStorage.getItem("pomodoro")
    if (session && session.length > 0) {
      setPomoSession(JSON.parse(session))
    }
  }, [])

  const handleNext = () => {
    setSelectedTask((prevTask) => (prevTask + 1) % tasks.length);
  };

  const handlePrev = () => {
    setSelectedTask((prevTask) => (prevTask - 1 + tasks.length) % tasks.length);
  };

  const getPreviousTaskIndex = (currentIndex: any) => (currentIndex - 1 + tasks.length) % tasks.length;
  const getNextTaskIndex = (currentIndex: any) => (currentIndex + 1) % tasks.length;

  const startPomoSession = () => {
    const newPomoSession = new Pomo();
    setPomoSession(newPomoSession);
    localStorage.setItem("pomodoro", JSON.stringify(newPomoSession));
  };
  const handleStop = () => {
    setPomoSession(null);
    localStorage.removeItem("pomodoro");
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
      <Grid item xs={12}>
        <Grid container justifyContent="center" p="32px" alignItems="center">
          {pomoSession ? (
            <>
              <Grid item>
                <IconButton onClick={handlePrev}>
                  <ArrowBackIosNewOutlined />
                </IconButton>
              </Grid>
              <PomoCard task={tasks[getPreviousTaskIndex(selectedTask)]} style={PreviousPaperStyle} />
              <PomoCard task={tasks[selectedTask]} style={PaperStyle} />
              <PomoCard task={tasks[getNextTaskIndex(selectedTask)]} style={PreviousPaperStyle} />
              <Button onClick={handleStop}>Stop</Button>
              <Grid item>
                <IconButton onClick={handleNext}>
                  <ArrowForwardIosOutlined />
                </IconButton>
              </Grid>
            </>
          ) : (
            <>
              <Button onClick={startPomoSession}>Start a session!</Button>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PomoBoard;
