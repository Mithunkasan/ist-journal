import EditorRegister from "@/components/admin/editorRegister";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import React from "react";

const EditorRegistration = () => {
  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      <EditorRegister fixedRole="EDITOR" title="Editor Registration Form" />
    </RoleGate>
  );
};

export default EditorRegistration;
