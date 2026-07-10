"use client";
import { RoleGate } from "@/components/auth/role-gate";
import { Box, Container } from "@mui/material";
import { UserRole } from "@prisma/client";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import AddUpcomingConference from "@/components/editor/Assignconference";

const AssignConference = () => {
  const router = useRouter();
  // const [open, setOpen] = useState(false);

  const handleBack = () => {
    router.back();
  };

  // const handleOpenModal = () => {
  //   setOpen(!open);
  // };

  return (
    <RoleGate allowedRole={UserRole.EDITOR}>
      <Container sx={{ marginBlock: "20px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <button
            className="bg-[#004b23] text-[#fff] w-[200px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
            onClick={handleBack}
          >
            <KeyboardBackspaceIcon />
            Back
          </button>
          {/* <button
            className="bg-[#004b23] text-[#fff] w-[200px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
            onClick={handleOpenModal}
          >
            <AddCircleOutlineIcon />
            Add Conferences
          </button>*/}
        </Box>

        {/* {open && (
          <AddUpcomingConference modalOpen={open} modalClose={setOpen} />
        )} */}
      </Container>
    </RoleGate>
  );
};

export default AssignConference;
