import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import { UserContext } from "../../App";

import {
  Box,
  Stack,
  TextField,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  ButtonGroup,
  Button,
  Divider,
  Dialog,
} from "@mui/material";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import NurseDelete from "./NurseDelete";
import NurseAction from "./NurseAction";
import "./nurseStyle.css";
import NurseDownload from "./NurseDownload";

const NurseList = () => {
  const { api_url } = useContext(UserContext);

  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawer, setDrawer] = useState({});
  const [selectedRow, setSelectedRow] = useState({});

  const fetchNurseList = () => {
    fetch(`${api_url}nurse`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRows(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleDrawer = (name, action, value) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
    setSelectedRow(value);
  };

  const actionRecord = (params) => {
    fetch(params?.id ? `${api_url}nurse/${params?.id}` : `${api_url}nurse`, {
      method: params?.id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: params?.name,
        dob: moment(params?.dob).format("YYYY-MM-DD"),
        age: params?.age,
        license: params?.license,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        setDrawer({});
        fetchNurseList();
      })
      .catch((error) => console.error("Error:", error));
  };

  const deleteRecord = (id) => {
    fetch(`${api_url}nurse/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        setDrawer({});
        fetchNurseList();
      })
      .catch((error) => console.error("Error deleting record:", error));
  };

  const handleExcel = () => {
    fetch(`${api_url}nurse/xlsx`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "nurse_data.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleCsv = () => {
    fetch(`${api_url}nurse/csv`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "nurse_data.csv");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchNurseList();
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, margin: "40px 40px 0" }}>
        Nurse List
      </Typography>
      <Divider
        sx={{
          width: 32,
          border: "2px solid #f00",
          marginLeft: "40px",
          borderRadius: 8,
        }}
      />
      <Box margin={4}>
        <Stack direction="row" gap={4} alignContent="center" mb={4}>
          <TextField
            size="small"
            sx={{ width: 700 }}
            placeholder="Search here..."
            type="search"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          <Button
            startIcon={<AddCircleOutlineIcon />}
            sx={{ color: "#088607", background: "#efefef" }}
            onClick={() => handleDrawer("nurseAction", true, {})}
          >
            Add
          </Button>
          <NurseDownload excelDownload={handleExcel} csvDownload={handleCsv} />
        </Stack>
        <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
          <Table sx={{ minWidth: 650 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>License Number</TableCell>
                <TableCell>Date Of Birth</TableCell>
                <TableCell>Age</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                ?.filter(
                  (val) =>
                    val?.name
                      ?.toLocaleLowerCase()
                      ?.includes(searchQuery?.toLocaleLowerCase()) ||
                    val?.license
                      ?.toLocaleLowerCase()
                      ?.includes(searchQuery?.toLocaleLowerCase())
                )
                ?.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.license}</TableCell>
                    <TableCell>
                      {moment(row.dob).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup sx={{ background: "#efefef" }}>
                        <Button
                          startIcon={<BorderColorIcon />}
                          style={{
                            color: "#f08b32",
                            border: "none",
                            borderRight: "1px solid #000",
                          }}
                          onClick={() => handleDrawer("nurseAction", true, row)}
                        >
                          Edit
                        </Button>
                        <Button
                          endIcon={<DeleteForeverIcon />}
                          style={{ color: "#f00", border: "none" }}
                          onClick={() =>
                            handleDrawer("deleteAction", true, row)
                          }
                        >
                          Remove
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              {rows?.filter(
                (val) =>
                  val?.name
                    ?.toLocaleLowerCase()
                    ?.includes(searchQuery?.toLocaleLowerCase()) ||
                  val?.license
                    ?.toLocaleLowerCase()
                    ?.includes(searchQuery?.toLocaleLowerCase())
              )?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={drawer?.nurseAction}
        onClose={() => handleDrawer("nurseAction", false, {})}
        PaperProps={{ style: { padding: 16, width: 400, borderRadius: 20 } }}
      >
        <NurseAction selectedRow={selectedRow} handleClick={actionRecord} />
      </Dialog>
      <Dialog
        open={drawer?.deleteAction}
        onClose={() => handleDrawer("deleteAction", false, {})}
        PaperProps={{ style: { padding: 16, width: 400, borderRadius: 20 } }}
      >
        <NurseDelete
          selectedRow={selectedRow}
          handleClick={deleteRecord}
          handleDrawer={handleDrawer}
        />
      </Dialog>
    </Box>
  );
};

export default NurseList;
