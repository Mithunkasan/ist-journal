import EditorRegister from "@/components/admin/editorRegister";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import React from "react";

const AssociateEditorRegistration = () => {
  return (
    <RoleGate allowedRole={UserRole.EDITOR}>
      <EditorRegister fixedRole="ASSOCIATE_EDITOR" title="Associate Editor Registration Form" />
    </RoleGate>
  );
};

export default AssociateEditorRegistration;
