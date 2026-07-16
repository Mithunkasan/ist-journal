"use client";

import React from "react";
import AuthorSubmitForm from "@/components/journals/AuthorSubmitForm";
import { Box, Typography, Paper } from "@mui/material";

type Props = { params: { paperID: string } };

const UpdatePage = ({ params }: Props) => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#004b23", mb: 4 }}>
        Update Submitted Paper
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <AuthorSubmitForm editPaperId={params.paperID} redirectPath="/author/submissions" />
      </Paper>
    </Box>
  );
};

export default UpdatePage;
