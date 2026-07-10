"use client";
import { RoleGate } from "@/components/auth/role-gate";
import { Container, Typography } from "@mui/material";
import { UserRole } from "@prisma/client";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { useEffect, useState } from "react";
import { Session } from "inspector";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import {
  AssignedJournalsrecords,
  onGetAllAssignedJournalRecords,
  onGetAllReviewer,
} from "@/redux/actions/journalActions";
import { JournalPaperType } from "@/types/Journals/author";
import { setLoading } from "@/redux/features/loading-slice";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const RejectedReviewerPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const session = useSession();

  const [flag, setFlag] = useState(false);
  const [reviewerJournalPaper, setReviewerJounalPaper] = useState([]);

  const loadingSlice = useSelector((data: any) => {
    data?.loaderSlice?.value?.isloading;
  });

  useEffect(() => {
    const FetchReviewerJournalPaper = async () => {
      const filterAllPaper = await dispatch(AssignedJournalsrecords());
      const filterByReviewerName = filterAllPaper?.filter((data: any) => {
        return data?.reviewers?.filter(
          (data: any) => data?.name === session?.data?.user?.name
        );
      });
      const filterByRejectedPaper = filterByReviewerName?.filter(
        (data: JournalPaperType) => {
          return data?.status === "REJECTED";
        }
      );
      setReviewerJounalPaper(filterByRejectedPaper);
    };
    setFlag(false);
    setLoading(true);
    FetchReviewerJournalPaper();
  }, [dispatch, session, flag]);

  const handleBackPage = () => {
    router.back();
  };

  return (
    <>
      <Container>
        <RoleGate allowedRole={UserRole.REVIEWER}>
          <button
            className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
            onClick={handleBackPage}
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
            Rejected
          </Typography>
          <JournalsTable
            journalsPaper={reviewerJournalPaper}
            setFlag={setFlag}
            flag={flag}
            loadingSlice={loadingSlice}
            titles="Reviewer_Rejected"
          />
        </RoleGate>
      </Container>
    </>
  );
};
export default RejectedReviewerPage;
