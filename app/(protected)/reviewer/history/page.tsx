"use client";
import { RoleGate } from "@/components/auth/role-gate";
import { Container, Typography } from "@mui/material";
import { UserRole } from "@prisma/client";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
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

const PublishedReviewerPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const session = useSession();

  const loadingSlice = useSelector(
    (data: any) => data?.loaderSlice?.value?.isLoading
  );

  const [flag, setFlag] = useState(false);

  const [reviewerJournalPaper, setReviewerJournalPaper] = useState([]);
  useEffect(() => {
    const FetchReviewerJournalPaper = async () => {
      try {
        const fetchAllPaper = await dispatch(AssignedJournalsrecords());
        const filterByReviewerName = fetchAllPaper?.filter((data: any) => {
          return data?.reviewers?.filter(
            (data: any) => data?.name === session?.data?.user?.name
          );
        });
        const filterByStatus = filterByReviewerName.filter(
          (data: JournalPaperType) => {
            return data?.status === "PUBLISHED";
          }
        );
        setReviewerJournalPaper(filterByStatus);
      } catch (error) {
        console.error("Fetching Error ", error);
      }
    };
    setFlag(false);
    setLoading(true);
    FetchReviewerJournalPaper();
  }, [session, flag,dispatch]);

  const handleRegisterClick = () => {
    router.back();
  };

  return (
    <>
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
            Published
          </Typography>
          <JournalsTable
            journalsPaper={reviewerJournalPaper}
            setFlag={setFlag}
            flag={flag}
            loadingSlice={loadingSlice}
            titles="Reviewer_Published"
          />
        </RoleGate>
      </Container>
    </>
  );
};
export default PublishedReviewerPage;
