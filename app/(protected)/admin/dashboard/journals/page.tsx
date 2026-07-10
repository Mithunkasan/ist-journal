"use client";

import React from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { MenuBook, Add } from "@mui/icons-material";

const JournalManagement = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23' }}>
          Journal Management
        </Typography>
        <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#004b23', borderRadius: 2 }}>
          Create Journal
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 10, borderRadius: 4, textAlign: 'center', bgcolor: '#f8fafc', border: '2px dashed #cbd5e1' }}>
            <MenuBook sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#64748b' }}>
              No active journals found. Start by creating your first journal.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JournalManagement;
