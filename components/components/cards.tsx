"use client";
import { useAppDispatch } from "@/lib/hooks/redux";
import {
  AssignedJournalsrecords,
  onGetAllAssignedJournalRecords,
  onGetAllPublishedPaper,
} from "@/redux/actions/journalActions";
import { Box, Container, Grid, Tooltip, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Cards = () => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [assignedJournalPaper, setAssignedJounalPaper] = React.useState<any>([]);

  const [publishedPaper, setPublishedPaper] = React.useState<any>([]);

  const handleRouterClick = () => {
    router.push("/associate/queue");
  };
  const handleRouterPublishedPage = () => {
    router.push("/associate/publishedPaper");
  };

  useEffect(() => {
    const FetchAllAssignedJournalPaper = async () => {
      try {
        const allAssignedJournalPaper = await dispatch(
          AssignedJournalsrecords()
        );

        const filteredJournalByAssociate = allAssignedJournalPaper?.filter(
          (data: any) => {
            return data?.associateEditor === session?.data?.user?.name;
          }
        );

        const filterJournalAssociateWithStatus =
          filteredJournalByAssociate?.filter((data: any) => {
            return data?.status === "ACCEPTED";
          });
        const filterPublishedPaper = filteredJournalByAssociate?.filter(
          (data: any) => {
            return data?.status === "PUBLISHED";
          }
        );
        setPublishedPaper(filterPublishedPaper);
        setAssignedJounalPaper(filterJournalAssociateWithStatus);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    FetchAllAssignedJournalPaper();
  }, [dispatch, session?.data?.user?.name]); // Add 'session?.data?.user?.name' to the dependency array

  return (
    <Grid container sx={{ marginBlock: "20px" }} spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Box
          onClick={handleRouterClick}
          sx={{
            paddingBlock: "10px",
            backgroundColor: "rgba(217,217,217,0.25)",
            paddingInline: "15px",
            borderRadius: "5px",
            maxWidth: "200px",
            border: "1px solid #38B000",
            cursor: "pointer",
          }}
        >
          <Typography
            component={"p"}
            sx={{
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "inherit",
              color: "black",
            }}
          >
            Under Review
          </Typography>
          <Typography
            component={"p"}
            sx={{
              textAlign: "right",
              fontSize: "28px",
              fontWeight: 600,
              color: "#006433",
            }}
          >
            <Tooltip title="Under Review" arrow>
              <Typography
                sx={{
                  textAlign: "right",
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#006433",
                }}
                component={"span"}
              >
                {assignedJournalPaper?.length >= 1
                  ? assignedJournalPaper.length >= 9
                    ? assignedJournalPaper.length
                    : `0${assignedJournalPaper.length}`
                  : "0"}
              </Typography>
            </Tooltip>
          </Typography>
        </Box>
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4} lg={3}>
        <Box
          onClick={handleRouteAssignedPapers}
          sx={{
            paddingBlock: "10px",
            backgroundColor: "rgba(217,217,217,0.25)",
            paddingInline: "15px",
            borderRadius: "5px",
            maxWidth: "200px",
            border: "1px solid #38B000",
            cursor: "pointer",
          }}
        >
          <Typography
            component={"p"}
            sx={{
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "inherit",
              color: "black",
            }}
          >
            Assigned Papers
          </Typography>
          <Typography
            component={"p"}
            sx={{
              textAlign: "right",
              fontSize: "28px",
              fontWeight: 600,
              color: "#006433",
            }}
          >
            <Tooltip title="Assigned Papers" arrow>
              <Typography
                sx={{
                  textAlign: "right",
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#006433",
                }}
                component={"span"}
              >
                {assignedReviewerJournalPaper?.length >= 1
                  ? assignedReviewerJournalPaper.length >= 9
                    ? assignedReviewerJournalPaper.length
                    : `0${assignedReviewerJournalPaper.length}`
                  : "0"}
              </Typography>
            </Tooltip>
          </Typography>
        </Box>
      </Grid> */}
      {/* <Grid item xs={12} sm={6} md={4} lg={3}>
        <Box
          onClick={handleRouteArchivedPaper}
          sx={{
            paddingBlock: "10px",
            backgroundColor: "rgba(217,217,217,0.25)",
            paddingInline: "15px",
            borderRadius: "5px",
            maxWidth: "200px",
            border: "1px solid #38B000",
            cursor: "pointer",
          }}
        >
          <Typography
            component={"p"}
            sx={{
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "inherit",
              color: "black",
            }}
          >
            Review Completed
          </Typography>
          <Typography
            component={"p"}
            sx={{
              textAlign: "right",
              fontSize: "28px",
              fontWeight: 600,
              color: "#006433",
            }}
          >
            {archiveJournalPaper?.length >= 1
              ? archiveJournalPaper?.length >= 9
                ? archiveJournalPaper?.length
                : `0${archiveJournalPaper.length}`
              : "0"}
          </Typography>
        </Box>
      </Grid> */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Box
          sx={{
            paddingBlock: "10px",
            backgroundColor: "rgba(217,217,217,0.25)",
            paddingInline: "15px",
            borderRadius: "5px",
            maxWidth: "200px",
            border: "1px solid #38B000",
            cursor: "pointer",
          }}
          onClick={handleRouterPublishedPage}
        >
          <Typography
            component={"p"}
            sx={{
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "inherit",
              color: "black",
            }}
          >
            Published Papers
          </Typography>
          <Typography
            component={"p"}
            sx={{
              textAlign: "right",
              fontSize: "28px",
              fontWeight: 600,
              color: "#006433",
            }}
          >
            {publishedPaper?.length >= 1
              ? publishedPaper.length >= 9
                ? publishedPaper.length
                : `0${publishedPaper.length}`
              : "0"}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Cards;
