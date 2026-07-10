"use client";
import React, { useEffect } from "react";
import {
  AssignJournalPaper,
  onGetAllEditors,
  onGetAllJournalRecords,
  updateSubmittedJournalPaper,
} from "@/redux/actions/journalActions";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import { useSelector } from "react-redux";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { JournalPaperType } from "@/types/Journals/author";
import { useAppDispatch } from "@/lib/hooks/redux";
import JournalTableTwo from "@/components/ui/tables/Admin/Queue/JournalTableTwo";
import { Container } from "@mui/material";

const Queue = () => {
  const router = useRouter();

  const editorData = useSelector(
    (state: any) => state?.editorSlice?.value?.editorData
  );

  const loaderData = useSelector(
    (state: any) => state?.loaderSlice?.value?.isLoading
  );

  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(true);
  const [journalPaper, setJounalPaper] = React.useState<any>([]);


  useEffect(() => {
    dispatch(onGetAllEditors());
  }, [dispatch]);

  useEffect(() => {
    const FetchAllJournalPaper = async () => {
      try {
        const allJournalPaper = await dispatch(onGetAllJournalRecords());

        const filterJournalDetails = allJournalPaper?.filter(
          (data: JournalPaperType) => data.status === "SUBMITTED"
        );
        setLoading(false);
        setJounalPaper(filterJournalDetails);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    FetchAllJournalPaper();
  }, [loading,dispatch]);
  const handleBackButton = () => {
    router.back();
  };

  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      <Container sx={{ marginBlock: "20px" }}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={handleBackButton}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>

        <JournalTableTwo
          journalPaper={journalPaper}
          editorData={editorData}
          title="Submitted Papers"
          createJournalData={AssignJournalPaper}
          updateSubmitPaper={updateSubmittedJournalPaper}
          setLoading={setLoading}
          loader={loading}
          isloading={loaderData}
        />
      </Container>
    </RoleGate>
  );
};

export default Queue;
