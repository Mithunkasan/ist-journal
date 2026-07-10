"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { RateReview } from "@mui/icons-material";

const CoordinationPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        Review Coordination
      </Typography>
      <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4 }}>
        <RateReview sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          Coordinate with reviewers and track review progress here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default CoordinationPage;
