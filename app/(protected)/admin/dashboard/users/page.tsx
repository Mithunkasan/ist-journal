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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { Search, FilterList, Edit, Delete, PersonAdd, Visibility } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const UserManagement = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // View Details Modal
  const [selectedUserForView, setSelectedUserForView] = useState<any | null>(null);

  // Edit Modal
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    Status: "",
    university: "",
    qualification: "",
    areaOfExpertise: ""
  });
  const [updating, setUpdating] = useState(false);

  // Delete Modal
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<any | null>(null);
  const [deleteEmailConfirm, setDeleteEmailConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleViewClick = (user: any) => {
    setSelectedUserForView(user);
  };

  const handleEditClick = (user: any) => {
    setSelectedUserForEdit(user);
    setEditForm({
      name: user.name || "",
      role: user.role || "",
      Status: user.Status || "ACTIVE",
      university: user.university || "",
      qualification: user.qualification || "",
      areaOfExpertise: user.areaOfExpertise || ""
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;
    setUpdating(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserForEdit.id,
          ...editForm
        })
      });
      if (response.ok) {
        setSelectedUserForEdit(null);
        alert("User updated successfully!");
        fetchUsers();
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Failed to update user", error);
      alert("An error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUserForDelete(user);
    setDeleteEmailConfirm("");
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForDelete) return;
    if (deleteEmailConfirm !== selectedUserForDelete.email) {
      alert("Email address does not match!");
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/users?userId=${selectedUserForDelete.id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setSelectedUserForDelete(null);
        alert("User deleted permanently!");
        fetchUsers();
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("An error occurred.");
    } finally {
      setDeleting(false);
    }
  };

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
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="info"
                        onClick={() => handleViewClick(user)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#d32f2f' }}
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
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
      {/* View User Details Dialog */}
      <Dialog
        open={Boolean(selectedUserForView)}
        onClose={() => setSelectedUserForView(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#004b23" }}>
          User Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedUserForView && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
              <Typography variant="body1"><strong>Full Name:</strong> {selectedUserForView.name || "N/A"}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {selectedUserForView.email}</Typography>
              <Typography variant="body1"><strong>Role:</strong> {selectedUserForView.role}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {selectedUserForView.Status || "ACTIVE"}</Typography>
              <Typography variant="body1"><strong>University:</strong> {selectedUserForView.university || "N/A"}</Typography>
              <Typography variant="body1"><strong>Qualification:</strong> {selectedUserForView.qualification || "N/A"}</Typography>
              <Typography variant="body1"><strong>Areas of Expertise:</strong> {selectedUserForView.areaOfExpertise || "N/A"}</Typography>
              <Typography variant="body1">
                <strong>Registered Date:</strong> {selectedUserForView.createdDate ? new Date(selectedUserForView.createdDate).toLocaleString() : "N/A"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUserForView(null)} variant="contained" sx={{ bgcolor: "#004b23", "&:hover": { bgcolor: "#003b1c" } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Details Dialog */}
      <Dialog
        open={Boolean(selectedUserForEdit)}
        onClose={() => setSelectedUserForEdit(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#004b23" }}>
          Edit User Details
        </DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Full Name"
              required
              fullWidth
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editForm.role}
                label="Role"
                onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="EDITOR">Editor</MenuItem>
                <MenuItem value="ASSOCIATE_EDITOR">Associate Editor</MenuItem>
                <MenuItem value="REVIEWER">Reviewer</MenuItem>
                <MenuItem value="AUTHOR">Author (User)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.Status}
                label="Status"
                onChange={(e) => setEditForm(prev => ({ ...prev, Status: e.target.value }))}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="IN_ACTIVE">In-Active</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="University"
              fullWidth
              value={editForm.university}
              onChange={(e) => setEditForm(prev => ({ ...prev, university: e.target.value }))}
            />
            <TextField
              label="Qualification"
              fullWidth
              value={editForm.qualification}
              onChange={(e) => setEditForm(prev => ({ ...prev, qualification: e.target.value }))}
            />
            <TextField
              label="Areas of Expertise"
              fullWidth
              value={editForm.areaOfExpertise}
              placeholder="e.g. Artificial Intelligence, Data Analysis"
              onChange={(e) => setEditForm(prev => ({ ...prev, areaOfExpertise: e.target.value }))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedUserForEdit(null)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updating}
              sx={{ bgcolor: "#004b23", "&:hover": { bgcolor: "#003b1c" } }}
            >
              {updating ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Save Updates"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={Boolean(selectedUserForDelete)}
        onClose={() => setSelectedUserForDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#d32f2f" }}>
          Confirm Delete
        </DialogTitle>
        <form onSubmit={handleDeleteSubmit}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1" sx={{ color: "#000" }}>
              Are you sure you want to permanently delete <strong>{selectedUserForDelete?.name || "this user"}</strong>?
            </Typography>
            <Typography variant="body2" sx={{ bgcolor: '#fee2e2', p: 1.5, borderRadius: 1.5, color: '#991b1b', border: '1px solid #fca5a5' }}>
              Warning: This action is irreversible. All associated reviewer assignments and user data will be deleted.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#000" }}>
              To verify deletion, please type or copy/paste the user&apos;s email address:<br />
              <strong>{selectedUserForDelete?.email}</strong>
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Type user's email to confirm..."
              value={deleteEmailConfirm}
              onChange={(e) => setDeleteEmailConfirm(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedUserForDelete(null)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={deleting || deleteEmailConfirm !== selectedUserForDelete?.email}
            >
              {deleting ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Permanently Delete"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
