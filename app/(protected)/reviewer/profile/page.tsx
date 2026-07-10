"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Person } from "@mui/icons-material";

const ProfilePage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        My Profile
      </Typography>
      <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4 }}>
        <Person sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          Manage your professional profile and areas of expertise.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
