"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { LibraryBooks } from "@mui/icons-material";

const PublishedPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        Published Papers
      </Typography>
      <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4 }}>
        <LibraryBooks sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          Congratulations! Here you will find all your successfully published research papers.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PublishedPage;
