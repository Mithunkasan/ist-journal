"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { formatPaperId } from "@/lib/utils/utils";

// Icons
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";

// Lazy-loaded components
const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const ViewPaper = dynamic(() => import("@/components/admin/viewPaper"), {
  ssr: false,
});

const SubmissionsPage = () => {
  const router = useRouter();
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Detailed modal state
  const [selectedPaper, setSelectedPaper] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Document preview state (using original ViewPaper)
  const [previewPaper, setPreviewPaper] = useState<any[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/author/papers");
        setPapers(response.data);
      } catch (error) {
        console.error("Error fetching author papers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [flag]);

  const handleOpenDetails = (paper: any) => {
    setSelectedPaper(paper);
    setIsDetailOpen(true);
  };

  const handlePreviewPaper = (paper: any) => {
    setPreviewPaper([paper]);
    setIsPreviewOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#004b23" }}>
          My Submissions
        </Typography>

        {/* View Toggle */}
        <Stack direction="row" spacing={1} sx={{ bgcolor: "#e5e7f0", p: 0.5, borderRadius: 2.5 }}>
          <Button
            size="small"
            variant={viewMode === "table" ? "contained" : "text"}
            onClick={() => setViewMode("table")}
            startIcon={<TableChartRoundedIcon fontSize="small" />}
            sx={{
              bgcolor: viewMode === "table" ? "#004b23" : "transparent",
              color: viewMode === "table" ? "#fff" : "#004b23",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              py: 1,
              "&:hover": {
                bgcolor: viewMode === "table" ? "#003d1c" : "rgba(0, 75, 35, 0.08)",
              },
            }}
          >
            Table View
          </Button>
          <Button
            size="small"
            variant={viewMode === "card" ? "contained" : "text"}
            onClick={() => setViewMode("card")}
            startIcon={<GridOnRoundedIcon fontSize="small" />}
            sx={{
              bgcolor: viewMode === "card" ? "#004b23" : "transparent",
              color: viewMode === "card" ? "#fff" : "#004b23",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              py: 1,
              "&:hover": {
                bgcolor: viewMode === "card" ? "#003d1c" : "rgba(0, 75, 35, 0.08)",
              },
            }}
          >
            Card View
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Track Paper Status
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#004b23" }} />
          </Box>
        ) : papers.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              No submissions found.
            </Typography>
          </Box>
        ) : viewMode === "table" ? (
          <JournalsTable
            journalsPaper={papers}
            titles="under_process"
            setFlag={setFlag}
            flag={flag}
            loadingSlice={loading}
          />
        ) : (
          /* Card View Grid */
          <Grid container spacing={3}>
            {papers.map((paper: any) => {
              // Status Color configuration
              let statusColor = "warning";
              let statusLabel = paper.status || "Pending";
              if (statusLabel === "SUBMITTED" || statusLabel === "ASSIGNED_TO_EDITOR" || statusLabel === "EDITOR_SCREENING") {
                statusLabel = "Paper Submitted";
              } else {
                statusLabel = statusLabel.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
              }
              if (statusLabel.toLowerCase() === "published" || paper.isPublished === true) {
                statusColor = "success";
              } else if (statusLabel.toLowerCase() === "rejected") {
                statusColor = "error";
              }

              return (
                <Grid item xs={12} sm={6} md={4} key={paper.id}>
                  <Card
                    onClick={() => handleOpenDetails(paper)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      borderRadius: 3.5,
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 16px 32px rgba(0, 75, 35, 0.12)",
                        borderColor: "#004b23",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: "text.secondary",
                            bgcolor: "#e5e7f0",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                          }}
                        >
                          ID: {formatPaperId(paper.paperID)}
                        </Typography>
                        <Chip
                          label={statusLabel}
                          color={statusColor as any}
                          size="small"
                          sx={{ fontWeight: 800, textTransform: "capitalize", fontSize: "0.75rem" }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 800,
                          color: "#004b23",
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "4.5rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {paper.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          flexGrow: 1,
                          lineHeight: 1.5,
                        }}
                      >
                        {paper.abstract}
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />
                      <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", mb: 2 }}>
                        {paper.category && (
                          <Chip
                            label={paper.category}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "10px", fontWeight: 600, height: "24px" }}
                          />
                        )}
                        {paper.primaryDomain && (
                          <Chip
                            label={paper.primaryDomain}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "10px",
                              fontWeight: 600,
                              height: "24px",
                              color: "#004b23",
                              borderColor: "#004b23",
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto" }}>
                        <AccountCircleRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ fontWeight: 600 }}>
                          {paper.authorNames}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 3, pb: 3, pt: 0, justifyContent: "space-between" }}>
                      {(() => {
                        const editableStatuses = ["SUBMITTED", "ASSIGNED_TO_EDITOR", "EDITOR_SCREENING"];
                        const isEditable = editableStatuses.includes(paper.status ? String(paper.status).toUpperCase() : "");
                        return isEditable && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/author/update/${paper.paperID}`);
                            }}
                            sx={{
                              color: "#004b23",
                              borderColor: "#004b23",
                              fontWeight: 700,
                              borderRadius: 2,
                              textTransform: "none",
                              "&:hover": {
                                borderColor: "#003d1c",
                                bgcolor: "rgba(0, 75, 35, 0.05)",
                              },
                            }}
                          >
                            Update Details
                          </Button>
                        );
                      })()}
                      <Typography
                        variant="button"
                        sx={{
                          color: "#004b23",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        View Details <span style={{ fontSize: "1rem" }}>→</span>
                      </Typography>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>

      {/* Detailed View Dialog */}
      <Dialog
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            bgcolor: "#004b23",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, letterSpacing: 0.5 }}>
              SUBMISSION ID: {formatPaperId(selectedPaper?.paperID)}
            </Typography>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 800, pr: 4, lineHeight: 1.3 }}>
              {selectedPaper?.title}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setIsDetailOpen(false)}
            sx={{
              color: "#fff",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4, bgcolor: "#fafafa" }}>
          <Grid container spacing={3}>
            {/* Status & General Metadata */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                <Chip
                  label={`Status: ${
                    selectedPaper?.status === "SUBMITTED" || selectedPaper?.status === "ASSIGNED_TO_EDITOR" || selectedPaper?.status === "EDITOR_SCREENING"
                      ? "Paper Submitted"
                      : (selectedPaper?.status || "Pending").replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                  }`}
                  color={
                    (selectedPaper?.status || "pending").toLowerCase() === "published"
                      ? "success"
                      : (selectedPaper?.status || "pending").toLowerCase() === "rejected"
                      ? "error"
                      : "warning"
                  }
                  sx={{ fontWeight: 800, fontSize: "0.85rem", px: 1 }}
                />
                {selectedPaper?.category && (
                  <Chip
                    icon={<CategoryRoundedIcon fontSize="small" />}
                    label={`Category: ${selectedPaper.category}`}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                <Chip
                  icon={<DescriptionRoundedIcon fontSize="small" />}
                  label={`Type: ${selectedPaper?.type || "Research Paper"}`}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
            </Grid>

            {/* Abstract Box */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: "#004b23",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <DescriptionRoundedIcon /> Abstract
              </Typography>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}>
                <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {selectedPaper?.abstract}
                </Typography>
              </Paper>
            </Grid>

            {/* Details Grid */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#004b23", mb: 1.5 }}>
                Authorship & Contact
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <AccountCircleRoundedIcon sx={{ color: "#004b23", mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Author Name(s)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {selectedPaper?.authorNames}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <EmailRoundedIcon sx={{ color: "#004b23", mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Author Email ID(s)
                    </Typography>
                    <Typography variant="body2">{selectedPaper?.authorEmail}</Typography>
                  </Box>
                </Box>
                {selectedPaper?.orcid && (
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <KeyRoundedIcon sx={{ color: "#004b23", mt: 0.3 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        ORCID iD
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                        {selectedPaper?.orcid}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#004b23", mb: 1.5 }}>
                Journal Scope & Metadata
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <CategoryRoundedIcon sx={{ color: "#004b23", mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Primary Domain
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>
                      {selectedPaper?.primaryDomain}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <CategoryRoundedIcon sx={{ color: "#004b23", mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Secondary Domain
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>
                      {selectedPaper?.secondaryDomain}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <LanguageRoundedIcon sx={{ color: "#004b23", mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Country
                    </Typography>
                    <Typography variant="body2">{selectedPaper?.country}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Date & Keywords */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <CalendarTodayRoundedIcon sx={{ color: "#004b23", mt: 0.3 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Submission Date
                  </Typography>
                  <Typography variant="body2">
                    {selectedPaper?.createdAt
                      ? new Date(selectedPaper.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })
                      : "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <KeyRoundedIcon sx={{ color: "#004b23", mt: 0.3 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Keywords
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                    {selectedPaper?.keywords?.split(",").map((kw: string, i: number) => (
                      <Chip key={i} label={kw.trim()} size="small" variant="outlined" sx={{ fontSize: "11px" }} />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* File Attachments */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#004b23", mb: 2 }}>
                Manuscript Files & Attachments
              </Typography>
              <Grid container spacing={2}>
                {selectedPaper?.paperUrl && (
                  <Grid item xs={12} sm={4}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        alignItems: "center",
                        bgcolor: "#fff",
                      }}
                    >
                      <DescriptionRoundedIcon sx={{ fontSize: 40, color: "#004b23" }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, textAlign: "center" }}>
                        Main Manuscript
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<VisibilityRoundedIcon />}
                          onClick={() => handlePreviewPaper(selectedPaper)}
                          sx={{
                            bgcolor: "#004b23",
                            "&:hover": { bgcolor: "#003d1c" },
                            fontSize: "11px",
                            px: 1.5,
                            textTransform: "none",
                            borderRadius: 2,
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CloudDownloadRoundedIcon />}
                          href={selectedPaper.paperUrl}
                          target="_blank"
                          sx={{
                            color: "#004b23",
                            borderColor: "#004b23",
                            "&:hover": {
                              borderColor: "#003d1c",
                              bgcolor: "rgba(0, 75, 35, 0.05)",
                            },
                            fontSize: "11px",
                            px: 1.5,
                            textTransform: "none",
                            borderRadius: 2,
                          }}
                        >
                          Download
                        </Button>
                      </Stack>
                    </Paper>
                  </Grid>
                )}

                {selectedPaper?.supportingFilesUrl && (
                  <Grid item xs={12} sm={4}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        alignItems: "center",
                        bgcolor: "#fff",
                      }}
                    >
                      <CloudDownloadRoundedIcon sx={{ fontSize: 40, color: "#004b23" }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, textAlign: "center" }}>
                        Supporting Files
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CloudDownloadRoundedIcon />}
                        href={selectedPaper.supportingFilesUrl}
                        target="_blank"
                        sx={{
                          color: "#004b23",
                          borderColor: "#004b23",
                          "&:hover": {
                            borderColor: "#003d1c",
                            bgcolor: "rgba(0, 75, 35, 0.05)",
                          },
                          fontSize: "11px",
                          px: 2,
                          textTransform: "none",
                          borderRadius: 2,
                        }}
                      >
                        Download
                      </Button>
                    </Paper>
                  </Grid>
                )}

                {selectedPaper?.coverLetterUrl && (
                  <Grid item xs={12} sm={4}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        alignItems: "center",
                        bgcolor: "#fff",
                      }}
                    >
                      <DescriptionRoundedIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, textAlign: "center" }}>
                        Cover Letter
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CloudDownloadRoundedIcon />}
                        href={selectedPaper.coverLetterUrl}
                        target="_blank"
                        sx={{
                          color: "#004b23",
                          borderColor: "#004b23",
                          "&:hover": {
                            borderColor: "#003d1c",
                            bgcolor: "rgba(0, 75, 35, 0.05)",
                          },
                          fontSize: "11px",
                          px: 2,
                          textTransform: "none",
                          borderRadius: 2,
                        }}
                      >
                        Download
                      </Button>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: "#f1f3f5", justifyContent: "space-between" }}>
          {(() => {
            const editableStatuses = ["SUBMITTED", "ASSIGNED_TO_EDITOR", "EDITOR_SCREENING"];
            const isEditable = editableStatuses.includes(selectedPaper?.status ? String(selectedPaper.status).toUpperCase() : "");
            return isEditable && (
              <Button
                variant="outlined"
                onClick={() => {
                  setIsDetailOpen(false);
                  router.push(`/author/update/${selectedPaper?.paperID}`);
                }}
                sx={{
                  color: "#004b23",
                  borderColor: "#004b23",
                  px: 3,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#003d1c",
                    bgcolor: "rgba(0, 75, 35, 0.05)",
                  },
                }}
              >
                Update Details
              </Button>
            );
          })()}
          <Button
            onClick={() => setIsDetailOpen(false)}
            variant="contained"
            sx={{
              bgcolor: "#004b23",
              "&:hover": { bgcolor: "#003d1c" },
              px: 4,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <ViewPaper modalOpen={isPreviewOpen} setModalOpen={setIsPreviewOpen} data={previewPaper} />
      )}
    </Box>
  );
};

export default SubmissionsPage;
