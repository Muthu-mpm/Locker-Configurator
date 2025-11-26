import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = [
  "Select master blaster campaign settings",
  "Create an ad group",
  "Create an ad",
  "Select master blaster campaign settings",
  "Create an ad group",
  "Create an ad",
];

export default function ProgressBar({ step }) {
  return (
    <Box sx={{ width: "100%" }} className="relative -left-[8%]">
      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel></StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
