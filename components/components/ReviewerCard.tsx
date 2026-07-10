"use client";
import { useAppDispatch } from "@/lib/hooks/redux";
import {
  AssignedJournalsrecords,
} from "@/redux/actions/journalActions";
import { JournalPaperType } from "@/types/Journals/author";
import { Box, Grid, Tooltip, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ReviewerCard = () => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [reviewerJournalPaper, setReviewerJournalPaper] = useState<any[]>([]);
  const [reviewerPublished, setReviewerPublished] = useState<any[]>([]);
  const [reviewerRejected, setReviewerRejected] = useState<any[]>([]);
  const [reviewerRoundTwo, setReviewerRoundTwo] = useState<any[]>([]);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const allPapers = await dispatch(AssignedJournalsrecords());
        const sessionUserId = session?.data?.user?.id;

        if (!sessionUserId) return;

        const assignedPapers = allPapers.filter((data: any) =>
          data?.reviewers?.some((rev: any) => rev.id === sessionUserId)
        );

        const queue = assignedPapers.filter(
          (data: JournalPaperType) =>
            data.status !== "PUBLISHED" &&
            data.status !== "ACCEPTED" &&
            data.status !== "REJECTED" &&
            data.status !== "ROUND_TWO_PAPER"
        );

        const published = assignedPapers.filter(
          (data: JournalPaperType) => data.status === "PUBLISHED"
        );

        const rejected = assignedPapers.filter(
          (data: JournalPaperType) => data.status === "REJECTED"
        );

        const roundTwo = assignedPapers.filter(
          (data: JournalPaperType) => data.status === "ROUND_TWO_PAPER"
        );

        setReviewerJournalPaper(queue);
        setReviewerPublished(published);
        setReviewerRejected(rejected);
        setReviewerRoundTwo(roundTwo);
      } catch (error) {
        console.error("Error fetching reviewer papers:", error);
      }
    };

    fetchPapers();
  }, [dispatch, session?.data?.user?.id]);

  const formatCount = (count: number) =>
    count >= 1 ? (count >= 9 ? count : `0${count}`) : "0";

  const cardData = [
    {
      label: "Queue",
      count: formatCount(reviewerJournalPaper.length),
      onClick: () => handleNavigate("/reviewer/queue"),
    },
    {
      label: "Published Paper",
      count: formatCount(reviewerPublished.length),
      onClick: () => handleNavigate("/reviewer/published"),
    },
    {
      label: "Rejected Paper",
      count: formatCount(reviewerRejected.length),
      onClick: () => handleNavigate("/reviewer/rejected"),
    },
    {
      label: "Round Two Paper",
      count: formatCount(reviewerRoundTwo.length),
      onClick: () => handleNavigate("/reviewer/round-two"),
    },
  ];

  return (
    <Grid container spacing={3} sx={{ marginBlock: "20px" }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Box
            onClick={card.onClick}
            sx={{
              paddingBlock: "10px",
              paddingInline: "15px",
              borderRadius: "5px",
              maxWidth: "200px",
              border: "1px solid #38B000",
              backgroundColor: "rgba(217,217,217,0.25)",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "inherit",
                color: "black",
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                textAlign: "right",
                fontSize: "28px",
                fontWeight: 600,
                color: "#006433",
              }}
            >
              <Tooltip title={card.label} arrow>
                <span>{card.count}</span>
              </Tooltip>
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReviewerCard;
