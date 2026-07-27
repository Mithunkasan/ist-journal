"use client";

import React, { Suspense } from "react";
import GuestSidebar from "@/components/guest/GuestSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Box } from "@mui/material";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";

export default function GuestEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <RoleGate allowedRole={UserRole.GUEST_EDITOR}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f9fafb" }}>
        <AdminNavbar onMenuClick={() => setDrawerOpen(true)} />
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Suspense fallback={<Box sx={{ width: 240 }} />}>
            <GuestSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          </Suspense>
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
