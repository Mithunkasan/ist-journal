"use client";
import React, { Suspense } from "react";
import EditorRegister from "@/components/admin/editorRegister";
import { Container } from "@mui/material";

export const dynamic = "force-dynamic";

const GuestEditorRegisterPage = () => {
  return (
    <Container>
      <Suspense fallback={<div>Loading...</div>}>
        <EditorRegister title="Guest Editor Registration Form" />
      </Suspense>
    </Container>
  );
};

export default GuestEditorRegisterPage;
