"use client";
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import {
  AssignedJournalsrecords,
  OnUpdateAssignedJournalPaperIsPublished,
  onCreatePublishedPaper,
  onGetAllAssignedJournalRecords,
  onGetAllEditors,
  onGetFilterPaperByAccepted,
} from "@/redux/actions/journalActions";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import ViewPaper from "@/components/admin/viewPaper";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Popover from "@mui/material/Popover";
import { JournalPaperType } from "@/types/Journals/author";
import { useAppDispatch } from "@/lib/hooks/redux";
import FilterAssign from "@/components/editor/filterAssign";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const ArchiveJournalsPaper = () => {
  const router = useRouter();
  const session = useSession();

  const dispatch = useAppDispatch();

  const loadingSlice = useSelector(
    (state: any) => state.loaderSlice.value.isLoading
  );

  const [flag, setFlag] = React.useState(false);

  const [archiveJournalsPaper, setArchiveJournalsPaper] = React.useState<any>(
    []
  );
  const [reUpdatedJournal, setReUpdatedJournal] = React.useState(false);

  useEffect(() => {
    dispatch(onGetAllEditors());
  }, [dispatch]);

  useEffect(() => {
    const FetchallArchiveJournalPaper = async () => {
      try {
        const allArchiveJournalPaper = await dispatch(
          AssignedJournalsrecords()
        );

        const filteredJournalByEditor = allArchiveJournalPaper?.filter(
          (data: any) => {
            return data?.editorName === session?.data?.user?.name;
          }
        );

        const filterJournalEditorAssignToReviewer =
          filteredJournalByEditor?.filter((data: any) => {
            return data?.status === "ACCEPTED";
          });
        setArchiveJournalsPaper(filterJournalEditorAssignToReviewer);
        setFlag(false);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    FetchallArchiveJournalPaper();
  }, [dispatch, session, flag, reUpdatedJournal]);

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <RoleGate allowedRole={UserRole.EDITOR}>
      <Container sx={{ marginBlock: "20px" }}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] mt-7 mb-4 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={handleBackButtonClick}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>
        <FilterAssign
          filterJournal={setArchiveJournalsPaper}
          reUpdated={setReUpdatedJournal}
          filter={onGetFilterPaperByAccepted}
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
          Archive Papers
        </Typography>

        <JournalsTable
          journalsPaper={archiveJournalsPaper}
          flag={flag}
          setFlag={flag}
          loadingSlice={loadingSlice}
          titles="Archive_Papers"
        />
      </Container>
    </RoleGate>
  );
};

export default ArchiveJournalsPaper;
