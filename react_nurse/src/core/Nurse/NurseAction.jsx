import React, { useEffect, useState } from "react";

import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  Divider,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import "./nurseStyle.css";

const NurseAction = ({ selectedRow, handleClick }) => {
  const [localState, setLocalState] = useState({
    name: "",
    license: "",
    age: "",
    dob: new Date(),
  });
  const [validationErr, setValidationErr] = useState({
    name: false,
    license: false,
    age: false,
    dob: false,
  });

  const submitRecord = () => {
    if (Object?.values(localState)?.some((ele) => ele === "")) {
      setValidationErr({
        name: !localState?.name,
        license: !localState?.license,
        age: !localState?.age,
        dob: !localState?.dob,
      });
    } else {
      handleClick(
        selectedRow?.id
          ? { ...localState, id: selectedRow?.id }
          : { ...localState }
      );
    }
  };

  const handleBlur = (e) => {
    setValidationErr((prev) => ({
      ...prev,
      [e?.target?.name]: !e?.target?.value,
    }));
  };

  const onInputChange = (event) => {
    setLocalState((prev) => ({
      ...prev,
      [event?.target?.name]: event?.target?.value,
    }));
  };

  useEffect(() => {
    if (selectedRow?.id) {
      setLocalState(selectedRow);
    }
  }, [selectedRow]);

  return (
    <Box>
      <Typography>
        {selectedRow?.id ? `Edit ${selectedRow?.name}` : "Add New"}
      </Typography>
      <Divider sx={{ width: 20, border: "1px solid #f00", borderRadius: 8 }} />
      <Stack gap={4} mt={3}>
        <TextField
          onChange={onInputChange}
          label="Name"
          name="name"
          value={localState?.name}
          error={validationErr?.name}
          helperText={validationErr?.name ? "Enter the Name" : ""}
          onBlur={handleBlur}
        />
        <TextField
          onChange={onInputChange}
          label="License Number"
          name="license"
          value={localState?.license}
          error={validationErr?.license}
          helperText={validationErr?.license ? "Enter the License Number" : ""}
          onBlur={handleBlur}
        />
        <TextField
          onChange={onInputChange}
          label="Age"
          name="age"
          value={localState?.age}
          type="number"
          error={validationErr?.age}
          helperText={validationErr?.age ? "Enter the Age" : ""}
          onBlur={handleBlur}
        />

        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          dateFormats={{ fullDate: "DD-MM-YYYY" }}
        >
          <DatePicker
            format="DD-MM-YYYY"
            onChange={(e) =>
              onInputChange({ target: { name: "dob", value: e?.$d } })
            }
            views={["year", "month", "day"]}
            name="dob"
            value={dayjs(localState?.dob)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <Button variant="contained" onClick={submitRecord}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};
export default NurseAction;
