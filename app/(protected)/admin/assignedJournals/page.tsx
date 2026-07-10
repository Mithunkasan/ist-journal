"use client";
import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  AssignedJournalsrecords,
  onGetAllAssignedJournalRecords,
  onGetAllEditors,
  onGetFilterPaper,
} from "@/redux/actions/journalActions";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/lib/hooks/redux";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import FilterAssign from "@/components/editor/filterAssign";
import JournalTableTwo from "@/components/ui/tables/Admin/Queue/JournalTableTwo";

const AssignedJournals = () => {
  const router = useRouter();

  const editorData = useSelector(
    (state: any) => state?.editorSlice?.value?.editorData
  );

  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(true);
  const [assignedJournalPaper, setAssignedJounalPaper] = React.useState<any>(
    []
  );
  const [reUpdatedJournal, setReUpdatedJournal] = useState(false);
  const loaderData = useSelector(
    (state: any) => state?.loaderSlice?.value?.isLoading
  );

  useEffect(() => {
    dispatch(onGetAllEditors());
  }, [dispatch]);

    useEffect(() => {
    const FetchAllAssignedJournalPaper = async () => {
      try {
        const allAssignedJournalPaper = await dispatch(
          AssignedJournalsrecords()
        );
        setLoading(false);
        setAssignedJounalPaper(allAssignedJournalPaper);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    FetchAllAssignedJournalPaper();
  }, [dispatch]);


  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      <Container sx={{ marginBlock: "20px" }}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] my-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={handleBackButtonClick}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>

        <FilterAssign
          filterJournal={setAssignedJounalPaper}
          reUpdated={setReUpdatedJournal}
          filter={onGetFilterPaper}
          isEditor={true}
        // isStatus={true}
        />
        <JournalTableTwo
          journalPaper={assignedJournalPaper}
          editorData={editorData}
          title="Assigned Papers"
          setLoading={setLoading}
          loader={loading}
          isloading={loaderData}
        />
      </Container>
    </RoleGate>
  );
};

export default AssignedJournals;
