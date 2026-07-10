"use client";
import {
  Box,
  Chip,
  Container,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Theme, useTheme } from "@mui/material/styles";

import CircularProgress from "@mui/material/CircularProgress";
import {
  AssignedJournalsrecords,
  OnUpdateAssignedJournalPaper,
  onGetAllAssignedJournalRecords,
  onGetAllJournalRecords,
  onGetAllReviewer,
  updateSubmittedJournalPaper,
} from "@/redux/actions/journalActions";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { setLoading } from "@/redux/features/loading-slice";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const EditorQueue = () => {
  const session = useSession();
  const router = useRouter();

  const reviewersData = useSelector(
    (state: any) => state?.reviewerSlice?.value?.reviewerData
  );

  const loadingSlice = useSelector(
    (state: any) => state.loaderSlice.value.isLoading
  );

  const dispatch = useAppDispatch();

  const [flag, setFlag] = React.useState(false);
  const [filterJournalByStatus, setFilterJournalByStatus] = React.useState([]);
  useEffect(() => {
    dispatch(onGetAllReviewer());
  }, [dispatch]);

  useEffect(() => {
    const FetchAllAssignedJournalPaper = async () => {
      try {
        const allAssignedJournalPaper = await dispatch(
          AssignedJournalsrecords()
        );

        const sessionUserId = session?.data?.user?.id;

        const filterReviewerJournalPaper = allAssignedJournalPaper.filter((data: any) =>
          data?.reviewers?.some((reviewer: any) => reviewer.id === sessionUserId)
        );

        const filterReviewerJournalPaperByStatus =
          filterReviewerJournalPaper?.filter((data: any) => {
            return (
              data?.status !== "PUBLISHED" &&
              data?.status !== "ACCEPTED" &&
              data?.status !== "REJECTED" &&
              data?.status !== "ROUND_TWO_PAPER"
            );
          });

        setFlag(false);
        setFilterJournalByStatus(filterReviewerJournalPaperByStatus);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    setFlag(false);
    setLoading(true);
    FetchAllAssignedJournalPaper();
  }, [dispatch, session, flag]);

  const handleRegisterClick = () => {
    router.back();
  };

  return (
    <Container sx={{ marginBlock: "20px" }}>
      <RoleGate allowedRole={UserRole.REVIEWER}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={handleRegisterClick}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>
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
          Queue
        </Typography>
        <JournalsTable
          journalsPaper={filterJournalByStatus}
          setFlag={setFlag}
          flag={flag}
          loadingSlice={loadingSlice}
          titles="Reviewer_Queue"
        />
      </RoleGate>
    </Container>
  );
};

export default EditorQueue;
