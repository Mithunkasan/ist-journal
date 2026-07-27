"use client";

import React from "react";
import ReviewerSidebar from "@/components/reviewer/ReviewerSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Box } from "@mui/material";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";

export default function ReviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <RoleGate allowedRole={UserRole.REVIEWER}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f9fafb" }}>
        <AdminNavbar onMenuClick={() => setDrawerOpen(true)} />
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <ReviewerSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
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
    </RoleGate>
  );
}
