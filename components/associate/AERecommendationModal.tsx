"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RecommendIcon from "@mui/icons-material/Recommend";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

interface AERecommendationModalProps {
  open: boolean;
  onClose: () => void;
  paper: any;
  onSuccess: () => void;
}

export const AERecommendationModal = ({ open, onClose, paper, onSuccess }: AERecommendationModalProps) => {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const isChiefEditor = userRole === "EDITOR";
  const roleLabel = isChiefEditor ? "Chief Editor" : userRole === "GUEST_EDITOR" ? "Guest Editor" : "Associate Editor";

  const [recommendation, setRecommendation] = useState("Accept");
  const [comments, setComments] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !paper?.paperID) return;

    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const response = await fetch(`/api/associate-editor/reviews/${paper.paperID}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [open, paper]);

  if (!paper) return null;

  const handleSubmit = async () => {
    if (!comments.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please provide justification comments for the recommendation.",
        confirmButtonColor: "#004b23",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/associate-editor/submit-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperID: paper.paperID,
          recommendation,
          comments,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Recommendation Submitted",
          text: "Your recommendation has been submitted to the Editor-in-Chief.",
          confirmButtonColor: "#004b23",
        });
        onSuccess();
        onClose();
      } else {
        const errText = await response.text();
        throw new Error(errText || "Failed to submit recommendation");
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "An error occurred while saving your recommendation.",
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "95%", md: "850px" },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          p: 4,
          position: "relative",
          outline: "none",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#004b23", mb: 0.5 }}>
              {isChiefEditor ? "Submit Chief Editor Feedback" : `Submit ${roleLabel} Recommendation`}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
              Manuscript ID: {paper.paperID} | Title: &quot;{paper.title}&quot;
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#aaa" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* 1. Side-by-Side Reviewer Reports Section */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#333", mb: 2 }}>
          📋 Reviewer Reports
        </Typography>

        {loadingReviews ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={30} sx={{ color: "#004b23" }} />
          </Box>
        ) : reviews.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4, fontStyle: "italic" }}>
            No completed reviewer reports found.
          </Typography>
        ) : (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {reviews.map((rev: any, index: number) => (
              <Grid item xs={12} md={reviews.length > 1 ? 6 : 12} key={rev.id}>
                <Card variant="outlined" sx={{ borderRadius: 3, height: "100%", bgcolor: "#fafafa" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#004b23" }}>
                        Reviewer {index + 1}: {rev.reviewerName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: 
                            rev.recommendation === "Accept" ? "#f0fdf4" :
                            rev.recommendation === "Reject" ? "#fef2f2" : "#fffbeb",
                          color: 
                            rev.recommendation === "Accept" ? "#166534" :
                            rev.recommendation === "Reject" ? "#991b1b" : "#9a3412",
                          fontWeight: 800,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2
                        }}
                      >
                        {rev.recommendation}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 1.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155", mb: 0.5 }}>
                      Comments to Author:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#475569", mb: 2, lineHeight: 1.5 }}>
                      {rev.commentsToAuthor || "None"}
                    </Typography>
                    
                    {rev.commentsToEditor && (
                      <>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#b91c1c", mb: 0.5 }}>
                          Confidential Comments to Editor/AE:
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#7f1d1d", fontStyle: "italic", lineHeight: 1.5 }}>
                          {rev.commentsToEditor}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* 2. Synthesis and Recommendation Form */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#333", mb: 2 }}>
          ✍️ {isChiefEditor ? "My Feedback & Decision" : "My Recommendation"}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ fontWeight: 700, color: "#333", mb: 1, fontSize: "14px" }}>
              {isChiefEditor ? "My Decision Recommendation" : "My Synthesis Recommendation"} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              size="small"
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="Accept">Accept</MenuItem>
              <MenuItem value="Minor Revision">Minor Revision</MenuItem>
              <MenuItem value="Major Revision">Major Revision</MenuItem>
              <MenuItem value="Reject">Reject</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label={isChiefEditor ? "Feedback & Comments *" : "Justification & Synthesis Comments *"}
              multiline
              rows={4}
              placeholder={isChiefEditor ? "Provide your feedback and evaluation comments on the manuscript..." : "Provide a synthesis of all reviewers' feedback and explain the rationale behind your recommendation to the Editor-in-Chief..."}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: "10px" }
              }}
            />
          </Box>
        </Box>

        {/* Action Panel */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: "8px", px: 3, textTransform: "none", fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<RecommendIcon />}
            disabled={isSubmitting}
            onClick={handleSubmit}
            sx={{
              bgcolor: "#004b23",
              '&:hover': { bgcolor: "#003d1c" },
              borderRadius: "8px",
              px: 3,
              textTransform: "none",
              fontWeight: 700
            }}
          >
            {isChiefEditor ? "Submit Feedback" : "Submit Recommendation"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
