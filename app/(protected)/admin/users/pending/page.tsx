"use client";
import React, { useEffect, useState } from "react";
import { 
  Container, Typography, Paper, CircularProgress, Box, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button
} from "@mui/material";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import axios from "axios";

const PendingUsersPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/admin/users/pending");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching pending users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingUsers();
  }, [flag]);

  const handleApprove = async (userId: string) => {
    try {
      await axios.post("/api/admin/users/approve", {
        userId,
        action: "APPROVE",
      });
      setFlag(prev => !prev);
    } catch (error) {
      console.error("Failed to approve reviewer", error);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await axios.post("/api/admin/users/approve", {
        userId,
        action: "REJECT",
      });
      setFlag(prev => !prev);
    } catch (error) {
      console.error("Failed to reject reviewer", error);
    }
  };

  return (
    <RoleGate allowedRole={UserRole.EDITOR}>
      <Container sx={{ marginBlock: "20px" }}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={() => router.back()}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>

        <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', marginBlock: "30px", textAlign: "center" }}>
          Pending Reviewer Registrations
        </Typography>

        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#004b23' }} />
            </Box>
          ) : users.length === 0 ? (
            <Typography sx={{ textAlign: "center", py: 5, color: "#666" }}>
              No pending reviewers awaiting approval.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#F1F4FD" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: "#004b23" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#004b23" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#004b23" }}>University/Qualification</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#004b23" }}>Requested Role</TableCell>
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
                        <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 2, bgcolor: "#f0fdf4", color: "#004b23", fontSize: "0.875rem", fontWeight: 600 }}>
                          REVIEWER
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Button 
                            variant="contained" 
                            color="success" 
                            onClick={() => handleApprove(user.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleReject(user.id)}
                          >
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
    </RoleGate>
  );
};

export default PendingUsersPage;
