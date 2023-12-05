import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { myPalette } from '../../../theme';

const steps = ['To Do', 'In Progress', 'On Hold', "Completed"];

interface Props {
    value: number;
    callBack: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  }
  
  export const TaskStatusSteps: React.FC<Props> = ({ value, callBack }) => {
    const [activeStep, setActiveStep] = React.useState(value);
  
    React.useEffect(() => {
      setActiveStep(value === -1 ? 0 : value);
    }, [value]);

    const handleStep = (step: number) => () => {
        setActiveStep(step);
        callBack('status', step)
    };

    return (
        <Box sx={{ width: '100%', border: `1px solid ${myPalette[925]}`, padding: '12px', borderRadius: '6px'}}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}