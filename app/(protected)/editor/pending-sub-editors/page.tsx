"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import axios from "axios";

const PendingSubEditorsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    const fetchPendingSubEditors = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/admin/users/pending?role=ASSOCIATE_EDITOR");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching pending Associate Editors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSubEditors();
  }, [refreshFlag]);

  const submitDecision = async (userId: string, action: "APPROVE" | "REJECT") => {
    try {
      await axios.post("/api/admin/users/approve", {
        userId,
        action,
      });
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error(`Failed to ${action.toLowerCase()} Associate Editor`, error);
    }
  };

  return (
    <Container sx={{ marginBlock: "20px" }}>
      <button
        className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
        onClick={() => router.back()}
      >
        <KeyboardBackspaceIcon />
        Back
      </button>

      <Typography variant="h4" sx={{ fontWeight: 800, color: "#004b23", marginBlock: "30px", textAlign: "center" }}>
        Pending Associate Editor Registrations
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#004b23" }} />
          </Box>
        ) : users.length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 5, color: "#666" }}>
            No pending Associate Editors awaiting approval.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#F1F4FD" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: "#004b23" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#004b23" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#004b23" }}>University/Qualification</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#004b23" }}>Decision</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.university}</Typography>
                      <Typography variant="caption" color="textSecondary">{user.qualification}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Button variant="contained" color="success" onClick={() => submitDecision(user.id, "APPROVE")}>
                          Approve
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => submitDecision(user.id, "REJECT")}>
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default PendingSubEditorsPage;
