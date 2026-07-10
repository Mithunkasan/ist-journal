"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Settings } from "@mui/icons-material";

const SettingsPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        Account Settings
      </Typography>
      <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4 }}>
        <Settings sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          Manage your personal information and profile settings.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
