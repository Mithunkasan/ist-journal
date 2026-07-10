"use client";

import React from "react";
import AuthorSubmitForm from "@/components/journals/AuthorSubmitForm";
import { Box, Typography, Paper } from "@mui/material";

const SubmitPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        Submit New Paper
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <AuthorSubmitForm />
      </Paper>
    </Box>
  );
};

export default SubmitPage;
