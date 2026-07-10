"use client";
import { Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import {
  AssignedJournalsrecords,
  onGetAllAssignedJournalRecords,
  onGetAllAssociates,
  onGetAllEditors,
  onGetAllReviewer,
  onGetFilterPaper,
} from "@/redux/actions/journalActions";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/lib/hooks/redux";
import FilterAssign from "@/components/editor/filterAssign";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import axios from "axios";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const ReviewerAssignedJournals = () => {
  const router = useRouter();
  const session = useSession();

  const loadingSlice = useSelector(
    (state: any) => state.loaderSlice.value.isLoading
  );

  const dispatch = useAppDispatch();

  const [reviewerAssignedJournalPaper, setReviewerAssignedJounalPaper] =
    React.useState<any>([]);

  const [flag, setFlag] = React.useState(false);
  const [reUpdatedJournal, setReUpdatedJournal] = React.useState(false);

  // const associateData = useSelector(
  //   (state: any) => state?.associateSlice?.value?.associateData
  // );

  useEffect(() => {
    dispatch(onGetAllEditors());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetAllAssociates());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetAllReviewer());
  }, [dispatch]);

  useEffect(() => {
    const FetchAllAssignedJournalPaper = async () => {
      try {
        const response = await axios.get("/api/editor/papers");
        const filterJournalEditorAssignToReviewer = response.data?.filter((data: any) => {
          return (
            data?.status !== "ACCEPTED" &&
            data?.status !== "REJECTED" &&
            data?.status !== "PUBLISHED"
          );
        });
        setFlag(false);
        setReviewerAssignedJounalPaper(filterJournalEditorAssignToReviewer);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    setFlag(false);
    FetchAllAssignedJournalPaper();
  }, [dispatch, session, flag, reUpdatedJournal]);

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <RoleGate allowedRole={UserRole.EDITOR}>
      <Container sx={{ marginBlock: "20px" }}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] my-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={handleBackButtonClick}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>

        <FilterAssign
          filterJournal={setReviewerAssignedJounalPaper}
          reUpdated={setReUpdatedJournal}
          filter={onGetFilterPaper}
        />

        <Typography
          sx={{
            marginBlock: "20px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#004b23",
            fontFamily: "inherit",
            textAlign: "center",
          }}
        >
          Assigned Papers
        </Typography>

        <JournalsTable
          journalsPaper={reviewerAssignedJournalPaper}
          setFlag={setFlag}
          flag={flag}
          loadingSlice={loadingSlice}
          titles={"Editor_Assign_Paper"}
        />
      </Container>
    </RoleGate>
  );
};

export default ReviewerAssignedJournals;
