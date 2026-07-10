"use client";

import React from "react";
import AuthorSidebar from "@/components/author/AuthorSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Box } from "@mui/material";

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      <AdminNavbar onMenuClick={() => setDrawerOpen(true)} />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <AuthorSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            overflowX: "hidden",
            minWidth: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
