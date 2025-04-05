import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ModeSelect({ mode, onModeChange }) {
  const handleChange = (event, newMode) => {
    if (newMode !== null) {
      onModeChange && onModeChange(newMode);
    }
  };

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{
        backgroundColor: "var(--primaryBg)",
        border: "none",
        borderRadius: "300px"
      }}
    >
      {["encrypt", "decrypt"].map((val) => (
        <ToggleButton
          key={val}
          value={val}
          sx={{
            fontSize: "14px",
            padding: "6px 12px",
            border: "1px solid green",
            borderRadius: "30px",
            color: "#cacaca",
            fontFamily: "monospace",
            textTransform: "capitalize",
            '&.Mui-selected': {
              backgroundColor: '#26802970',
              color: '#0f0',
              '&:hover': {
                backgroundColor: '#22df2970',
              },
            },
          }}
        >
          {val}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
