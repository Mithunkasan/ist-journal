"use client";

import React from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { Description, FileOpen } from "@mui/icons-material";

const SubmissionManagement = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23' }}>
          Submission Management
        </Typography>
        <Button variant="outlined" startIcon={<FileOpen />} sx={{ color: '#004b23', borderColor: '#004b23', borderRadius: 2 }}>
          Export All Submissions
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 10, borderRadius: 4, textAlign: 'center', bgcolor: '#f8fafc', border: '2px dashed #cbd5e1' }}>
            <Description sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#64748b' }}>
              Submissions will appear here once authors submit their papers.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubmissionManagement;
