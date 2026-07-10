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
import GavelIcon from "@mui/icons-material/Gavel";
import Swal from "sweetalert2";

interface EICDecisionModalProps {
  open: boolean;
  onClose: () => void;
  paper: any;
  onSuccess: () => void;
}

export const EICDecisionModal = ({ open, onClose, paper, onSuccess }: EICDecisionModalProps) => {
  const [decision, setDecision] = useState("ACCEPT");
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

  // Extract AE recommendation if present
  const aeFeedback = paper.revisionComments || "No AE track synthesis report submitted yet.";

  const handleSubmit = async () => {
    if (!comments.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please provide final evaluation comments to the author.",
        confirmButtonColor: "#004b23",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/editor/submit-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperID: paper.paperID,
          decision,
          comments,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Decision Processed",
          text: `Final decision has been saved, and the author has been notified via email.`,
          confirmButtonColor: "#004b23",
        });
        onSuccess();
        onClose();
      } else {
        const errText = await response.text();
        throw new Error(errText || "Failed to save final decision");
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: error.message || "An error occurred while saving the final EIC decision.",
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
          width: { xs: "95%", md: "900px" },
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
              EIC Decision Making Board
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

        {/* 1. AE Track Recommendation Synthesis */}
        <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: "#f8fafc", mb: 3, borderLeft: "5px solid #7b1fa2" }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#7b1fa2", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
              🎯 Associate Editor Track Recommendation
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#334155", fontStyle: "italic", lineHeight: 1.6 }}>
              {aeFeedback}
            </Typography>
          </CardContent>
        </Card>

        {/* 2. Reviewer Reports */}
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
                          Confidential Comments to Editor:
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

        {/* 3. Final Decision Form */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#333", mb: 2 }}>
          ⚖️ Editor-in-Chief Final Decision
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 700, color: "#333", mb: 1, fontSize: "14px" }}>
                  Final Editorial Decision <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  size="small"
                  sx={{ borderRadius: "8px" }}
                >
                  <MenuItem value="ACCEPT">Accept (Manuscript moves to Production Stage)</MenuItem>
                  <MenuItem value="MINOR_REVISION">Minor Revision (Formatting / minor reviews required)</MenuItem>
                  <MenuItem value="MAJOR_REVISION">Major Revision (Significant reviews / re-review required)</MenuItem>
                  <MenuItem value="REJECT">Reject (Paper rejected, workflow ends)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Decision Letter / Evaluation Feedback to Author *"
                multiline
                rows={4}
                placeholder="Write the formal decision letter to the author detailing EIC comments, specific revisions demanded, or rejection reasons..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: "10px" }
                }}
              />
            </Grid>
          </Grid>
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
            startIcon={<GavelIcon />}
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
            Submit Final Decision
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
