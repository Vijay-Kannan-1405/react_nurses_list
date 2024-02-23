import React, { useState } from "react";
import { Button, Stack, Popover } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const NurseDownload = ({ excelDownload, csvDownload }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleExcel = () => {
    setAnchorEl(null);
    excelDownload();
  };
  const handleCSV = () => {
    setAnchorEl(null);
    csvDownload();
  };

  return (
    <>
      <Button
        sx={{ background: "#efefef", marginLeft: "auto" }}
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={(e) => setAnchorEl(e?.currentTarget)}
      >
        Download
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            padding: "8px 0",
            marginTop: "4px",
            borderRadius: 8,
          },
        }}
      >
        <Stack alignItems="cenetr" gap="8px">
          <Button
            sx={{
              padding: "2px 12px",
              justifyContent: "start",
              textTransform: "unset",
              color: "#000",
            }}
            onClick={handleExcel}
          >
            Download as Excel
          </Button>
          <Button
            sx={{
              padding: "2px 12px",
              justifyContent: "start",
              textTransform: "unset",
              color: "#000",
            }}
            onClick={handleCSV}
          >
            Download as CSV
          </Button>
        </Stack>
      </Popover>
    </>
  );
};
export default NurseDownload;
