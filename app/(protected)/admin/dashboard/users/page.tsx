"use client";

import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  TextField, 
  InputAdornment,
  IconButton,
  Button,
  Menu,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { Search, FilterList, Edit, Delete, PersonAdd } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const UserManagement = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "error";
      case "EDITOR": return "primary";
      case "ASSOCIATE_EDITOR": return "secondary";
      case "REVIEWER": return "warning";
      case "AUTHOR": return "success";
      default: return "default";
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23' }}>
          User Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<PersonAdd />}
          onClick={() => router.push("/admin/editorregister")}
          sx={{ bgcolor: '#004b23', '&:hover': { bgcolor: '#003318' }, borderRadius: 2 }}
        >
          Add New Editor
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#666' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 }
          }}
        />
        <Button 
          variant="outlined" 
          startIcon={<FilterList />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ borderRadius: 2, color: '#004b23', borderColor: '#004b23', height: 56, minWidth: 140 }}
        >
          {roleFilter || "All Roles"}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => { setRoleFilter(null); setAnchorEl(null); }}>All Roles</MenuItem>
          <MenuItem onClick={() => { setRoleFilter("ADMIN"); setAnchorEl(null); }}>Admin</MenuItem>
          <MenuItem onClick={() => { setRoleFilter("EDITOR"); setAnchorEl(null); }}>Editor</MenuItem>
          <MenuItem onClick={() => { setRoleFilter("ASSOCIATE_EDITOR"); setAnchorEl(null); }}>Associate Editor</MenuItem>
          <MenuItem onClick={() => { setRoleFilter("REVIEWER"); setAnchorEl(null); }}>Reviewer</MenuItem>
          <MenuItem onClick={() => { setRoleFilter("AUTHOR"); setAnchorEl(null); }}>Author</MenuItem>
        </Menu>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#004b23' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{user.name || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={getRoleColor(user.role) as any} 
                      size="small" 
                      sx={{ fontWeight: 600, borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.Status || "ACTIVE"} 
                      color={user.Status === "IN_ACTIVE" ? "default" : "success"}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 600, borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#d32f2f' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#666' }}>
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserManagement;
