import AdminHomeVerticalTabs from "@/components/admin/adminHomeVerticalTabs";
import { RoleGate } from "@/components/auth/role-gate";
import { Container } from "@mui/material";
import { UserRole } from "@prisma/client";
import React from "react";

const AdminTabs = () => {
  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      <Container sx={{ marginBlock: "20px" }}>
        <AdminHomeVerticalTabs />
      </Container>
    </RoleGate>
  );
};

export default AdminTabs;
