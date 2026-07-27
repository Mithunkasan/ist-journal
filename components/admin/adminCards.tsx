"use client";
import { useAppDispatch } from "@/lib/hooks/redux";
import {
  AssignedJournalsrecords,
  onGetAllJournalRecords,
} from "@/redux/actions/journalActions";
import { setLoading } from "@/redux/features/loading-slice";
import { useAppSelector } from "@/redux/store";
import { JournalPaperType } from "@/types/Journals/author";
import { Box, Grid, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
// import Cite from "citation-js";

const AdminCards = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [submittedJournalPaper, setSubmittedJounalPaper] = React.useState<any>(
    []
  );
  const [assignedJournalPaper, setAssignedJounalPaper] = React.useState<any>(
    []
  );
  // const [citation, setCitation] = React.useState("");

  // const generateCitation = () => {
  //   // Extract metadata and format it as required by Citation.js
  //   const authors = articleData.authorNames.split(", ").map((author) => ({
  //     family: author.split(" ")[1],
  //     given: author.split(" ")[0],
  //   }));
  //   const data = {
  //     type: "article-journal",
  //     author: authors,
  //     title: articleData.title,
  //     "container-title": articleData.type,
  //     issued: {
  //       "date-parts": [[new Date(articleData.createdAt).getFullYear()]],
  //     },
  //     URL: articleData.paperUrl,
  //     DOI: "", // Add DOI if available
  //   };

  //   const cite = new Cite(data);

  //   const apaCitation = cite.format("bibliography", {
  //     format: "text",
  //     template: "apa",
  //   });

  //   setCitation(apaCitation);
  // };

  const handleRouterClick = () => {
    router.push("/admin/queue");
  };

  const handleRouteAssignedPapers = () => {
    router.push("/admin/assignedJournals");
  };

  useEffect(() => {
    const FetchAllJournalPaper = async () => {
      try {
        const allSumbittedJournalPaper = await dispatch(
          onGetAllJournalRecords()
        );

        const filtedSubmittedJournalPaper = allSumbittedJournalPaper?.filter(
          (data: JournalPaperType) => data?.status === "SUBMITTED"
        );
        setSubmittedJounalPaper(filtedSubmittedJournalPaper);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    FetchAllJournalPaper();
  }, [dispatch]);

    useEffect(() => {
      const FetchAllAssignedJournalPaper = async () => {
        try {
          const allAssignedJournalPaper = await dispatch(
            AssignedJournalsrecords()
          );
          setLoading(false);
          setAssignedJounalPaper(allAssignedJournalPaper);
        } catch (error) {
          console.error("Error fetching journal records:", error);
        }
      };
      FetchAllAssignedJournalPaper();
    }, [dispatch]);

  // console.log(citation, "citation");
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
            width: "100%",
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
                {submittedJournalPaper?.length >= 1
                  ? submittedJournalPaper.length >= 9
                    ? submittedJournalPaper.length
                    : `0${submittedJournalPaper.length}`
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
            width: "100%",
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
          sx={{
            paddingBlock: "10px",
            backgroundColor: "rgba(217,217,217,0.25)",
            paddingInline: "15px",
            borderRadius: "5px",
            width: "100%",
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
            Final Reviews
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
            0
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
            width: "100%",
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
            0
          </Typography>
        </Box>
      </Grid>

      {/* <button onClick={generateCitation}>Generate APA Citation</button>
      <div>{citation}</div> */}
    </Grid>
  );
};

export default AdminCards;
function FetchAllAssignedJournalPaper() {
  throw new Error("Function not implemented.");
}

