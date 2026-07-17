"use client";

export const dynamic = "force-dynamic";

import EditorRegister from "@/components/admin/editorRegister";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const EditorRegistrationContent = () => {
  const params = useSearchParams();
  const rawRole = params.get("role");
  let finalRole: "ADMIN" | "EDITOR" | "REVIEWER" | "AUTHOR" | undefined = undefined;
  let title = "User Registration Form";

  if (rawRole) {
    const uppercaseRole = rawRole.toUpperCase();
    if (uppercaseRole === "ADMIN") {
      finalRole = "ADMIN";
      title = "Admin Registration Form";
    } else if (uppercaseRole === "EDITOR") {
      finalRole = "EDITOR";
      title = "Editor Registration Form";
    } else if (uppercaseRole === "REVIEWER") {
      finalRole = "REVIEWER";
      title = "Reviewer Registration Form";
    } else if (uppercaseRole === "USER" || uppercaseRole === "AUTHOR") {
      finalRole = "AUTHOR";
      title = "User Registration Form";
    }
  }

  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      <EditorRegister fixedRole={finalRole as any} title={title} />
    </RoleGate>
  );
};

const EditorRegistration = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorRegistrationContent />
    </Suspense>
  );
};

export default EditorRegistration;
