"use client";
import { Container, TableCell, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Theme, useTheme } from "@mui/material/styles";

import {
  AssignedJournalsrecords,
  onGetAllAssignedJournalRecords,
  onGetAllReviewer,
} from "@/redux/actions/journalActions";
import { RoleGate } from "@/components/auth/role-gate";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { JournalPaperType } from "@/types/Journals/author";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { setLoading } from "@/redux/features/loading-slice";
import { UserRole } from "@prisma/client";
import dynamic from "next/dynamic";
import axios from "axios";

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
    (state: any) => state?.loaderSlice?.value?.isLoading
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
        const response = await axios.get("/api/editor/papers");
        const filteredJournalByStatuses = response.data?.filter((data: any) => {
          return data?.status !== "REJECTED" && data?.status !== "PUBLISHED";
        });
        setFlag(false);
        setFilterJournalByStatus(filteredJournalByStatuses);
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
    <RoleGate allowedRole={UserRole.EDITOR}>
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
          Queue
        </Typography>
        <JournalsTable
          journalsPaper={filterJournalByStatus}
          setFlag={setFlag}
          flag={flag}
          loadingSlice={loadingSlice}
          titles="Editor_Queue"
        />
      </Container>
    </RoleGate>
  );
};

export default EditorQueue;
