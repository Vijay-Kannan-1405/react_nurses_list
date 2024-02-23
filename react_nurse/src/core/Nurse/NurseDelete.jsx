import React from "react";

import { Box, Stack, Typography, Button, Divider } from "@mui/material";
import "./nurseStyle.css";

const NurseDelete = ({ selectedRow, handleDrawer, handleClick }) => {
  return (
    <Box>
      <Typography>Delete {selectedRow?.name}</Typography>
      <Divider sx={{ width: 20, border: "1px solid #f00", borderRadius: 8 }} />
      <Box my={2} mx={3}>
        <Typography>
          Are you sure? you want to, Delete this record Permenently?.
        </Typography>
        <Stack mt={4} direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            style={{ background: "#f08b32", borderRadius: 20 }}
            onClick={() => handleDrawer("deleteAction", false, {})}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            style={{ background: "#f00", borderRadius: 20 }}
            onClick={() => {
              handleClick(selectedRow?.id);
            }}
          >
            Confirm
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default NurseDelete;
