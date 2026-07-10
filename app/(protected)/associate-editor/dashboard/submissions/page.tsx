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
  OnUpdateAssignedJournalPaper,
  onGetAllAssignedJournalRecords,
  onGetAllAssociates,
  onGetAllJournalRecords,
  onGetAllReviewer,
  updateSubmittedJournalPaper,
} from "@/redux/actions/journalActions";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import ViewPaper from "@/components/admin/viewPaper";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { JournalPaperType } from "@/types/Journals/author";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const AssociateQueue = () => {
  const session = useSession();
  const router = useRouter();

  const loadingSlice = useSelector(
    (state: any) => state?.loaderSlice?.value?.isLoading
  );

  const dispatch = useAppDispatch();

  const [filterJournalByStatus, setFilterJournalByStatus] = React.useState([]);
  const [flag, setFlag] = React.useState(false); 

  useEffect(() => {
    dispatch(onGetAllAssociates());
  }, [dispatch]);

  useEffect(() => {
    const FetchAllAssignedJournalPaper = async () => {
      try {
        const userId = session?.data?.user?.id;
        if (!userId) return;
        const result = await dispatch(onGetAllAssignedJournalRecords(userId));
        const journalData = result.payload || [];

        // Now filter the data from the dispatched action payload
        const filteredJournalByAssociate = journalData.filter(
          (data: any) => {
            return (
              data.associateEditor === session?.data?.user?.name &&
              data.status === "ACCEPTED"
            );
          }
        );
        setFlag(false);
        setFilterJournalByStatus(filteredJournalByAssociate);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    FetchAllAssignedJournalPaper();
  }, [session, flag, dispatch]);

  // const ViewButton = (paperID: any) => {
  //   router.push(`/associate/queue/updateForm/${paperID}`);
  // };

  const handleRegisterClick = () => {
    router.back();
  };

  return (
    <RoleGate allowedRole={UserRole.ASSOCIATE_EDITOR}>
      <Container sx={{ marginBlock: "20px" }}>
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
          Under Review
        </Typography>
        <Paper sx={{ maxWidth: "100%", overflow: "hidden", marginTop: "20px" }}>
          <JournalsTable
            journalsPaper={filterJournalByStatus}
            flag={flag}
            setFlag={setFlag}
            loadingSlice={loadingSlice}
            titles="under_process"
          />
        </Paper>
      </Container>
    </RoleGate>
  );
};

export default AssociateQueue;
