"use client";
import { useAppDispatch } from "@/lib/hooks/redux";
import { AssignedJournalsrecords} from "@/redux/actions/journalActions";
import { Box, Container, Grid, Tooltip, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const EditorCards = () => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [assignedJournalPaper, setAssignedJounalPaper] = React.useState<any>(
    []
  );
  const [assignedReviewerJournalPaper, setAssignedReviewerJournalPaper] =
    React.useState<any>([]);

  const [archiveJournalPaper, setArchiveJournalPaper] = React.useState<any>([]);
  const [rejectedJournalPaper, setRejectedJournalPaper] = React.useState<any>(
    []
  );

  const handleRouterClick = () => {
    router.push("/editor/submissions");
  };
  const handleRouterRejectedPage = () => {
    router.push("/editor/rejectedJournals");
  };

  const handleRouteAssignedPapers = () => {
    router.push("/editor/assign");
  };
  const handleRouteArchivedPaper = () => {
    router.push("/editor/archiveJournalsPaper");
  };

  useEffect(() => {
    const FetchAllAssignedJournalPaper = async () => {
      try {
        const allAssignedJournalPaper = await dispatch(
          AssignedJournalsrecords()
        );

        const filteredJournalByEditor = allAssignedJournalPaper?.filter(
          (data: any) => {
            return data?.editorName === session?.data?.user?.name;
          }
        );

        const filterJournalEditorWithStatus = filteredJournalByEditor?.filter(
          (data: any) => {
            return data?.status === "ASSIGNED_TO_EDITOR";
          }
        );

        const filterJournalEditorAssignToReviewer =
          filteredJournalByEditor?.filter((data: any) => {
            return (
              data?.status !== "ASSIGNED_TO_EDITOR" &&
              data?.status !== "SUBMITTED" &&
              data?.status !== "ACCEPTED" &&
              data?.status !== "REJECTED" &&
              data?.status !== "PUBLISHED"
            );
          });

        const filterAssignedPaperToArchivePaper =
          filteredJournalByEditor?.filter((data: any) => {
            return data?.status === "ACCEPTED";
          });

        const filterRejectedPaperToArchivePaper =
          filteredJournalByEditor?.filter((data: any) => {
            return data?.status === "REJECTED";
          });

        setRejectedJournalPaper(filterRejectedPaperToArchivePaper);
        setArchiveJournalPaper(filterAssignedPaperToArchivePaper);
        setAssignedReviewerJournalPaper(filterJournalEditorAssignToReviewer);
        setAssignedJounalPaper(filterJournalEditorWithStatus);
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
            My Queue
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
            <Tooltip title="Queue" arrow>
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
      <Grid item xs={12} sm={6} md={4} lg={3}>
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
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
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
            Archives
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
      </Grid>
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
          onClick={handleRouterRejectedPage}
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
            Rejected Papers
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
            {rejectedJournalPaper?.length >= 1
              ? rejectedJournalPaper.length >= 9
                ? rejectedJournalPaper.length
                : `0${rejectedJournalPaper.length}`
              : "0"}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default EditorCards;
