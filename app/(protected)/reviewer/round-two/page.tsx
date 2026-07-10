"use client";
import {
  Container,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { AssignedJournalsrecords, onGetAllReviewer } from "@/redux/actions/journalActions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import { useSelector } from "react-redux";
import { setLoading } from "@/redux/features/loading-slice";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const ReviewerRoundTwo = () => {
  const session = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [flag, setFlag] = useState(false);
  const [roundTwoPapers, setRoundTwoPapers] = useState<any[]>([]);

  const loadingSlice = useSelector(
    (state: any) => state.loaderSlice.value.isLoading
  );

  useEffect(() => {
    dispatch(onGetAllReviewer());
  }, [dispatch]);

  useEffect(() => {
    const fetchRoundTwoPapers = async () => {
      try {
        const allPapers = await dispatch(AssignedJournalsrecords());
        const sessionUserId = session?.data?.user?.id;

        const assignedToReviewer = allPapers.filter((data: any) =>
          data?.reviewers?.some((rev: any) => rev.id === sessionUserId)
        );

        const roundTwoOnly = assignedToReviewer.filter(
          (data: any) => data?.status === "ROUND_TWO_PAPER"
        );

        setRoundTwoPapers(roundTwoOnly);
        setFlag(false);
      } catch (error) {
        console.error("Error fetching Round Two papers:", error);
      }
    };

    setLoading(true);
    fetchRoundTwoPapers();
  }, [dispatch, session?.data?.user?.id, flag]);

  const handleBack = () => {
    router.back();
  };

  return (
    <Container sx={{ marginBlock: "20px" }}>
      <RoleGate allowedRole={UserRole.REVIEWER}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={handleBack}
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
          Round One Papers
        </Typography>
        <JournalsTable
          journalsPaper={roundTwoPapers}
          setFlag={setFlag}
          flag={flag}
          loadingSlice={loadingSlice}
          titles="Reviewer_Round_Two" // Ensure your table component handles this case
        />
      </RoleGate>
    </Container>
  );
};

export default ReviewerRoundTwo;
