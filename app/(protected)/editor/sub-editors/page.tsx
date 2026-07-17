"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress, Button, Box } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import axios from "axios";

const SubEditorsManagement = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subEditors, setSubEditors] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchSubEditors = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/get-associate");
      setSubEditors(response.data);
    } catch (error) {
      console.error("Failed to fetch sub-editors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubEditors();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container sx={{ marginBlock: "20px" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={() => router.back()}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>

        <button
          className="bg-[#004b23] text-[#fff] w-[250px] px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={() => router.push("/editor/associate-register")}
        >
          <AddCircleIcon />
          Add Sub Editor
        </button>
      </Box>

      <Typography
        sx={{
          marginBlock: "25px",
          fontSize: "24px",
          fontWeight: 800,
          color: "#004b23",
          fontFamily: "inherit",
          textAlign: "center",
        }}
      >
        List Of Sub Editors
      </Typography>

      <Paper sx={{ maxWidth: "100%", overflow: "hidden", borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#004b23" }} />
          </Box>
        ) : subEditors.length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 5, color: "#666" }}>
            No Sub Editors found.
          </Typography>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#004b23", fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ color: "#004b23", fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ color: "#004b23", fontWeight: 700 }}>Qualification</TableCell>
                    <TableCell sx={{ color: "#004b23", fontWeight: 700 }}>University</TableCell>
                    <TableCell sx={{ color: "#004b23", fontWeight: 700 }}>Expertise</TableCell>
                    <TableCell sx={{ color: "#004b23", fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subEditors
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any) => (
                      <TableRow hover key={row.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{row.name || "N/A"}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.qualification || "N/A"}</TableCell>
                        <TableCell>{row.university || "N/A"}</TableCell>
                        <TableCell>{row.areaOfExpertise || "N/A"}</TableCell>
                        <TableCell>{row.Status || "ACTIVE"}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={subEditors.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default SubEditorsManagement;
