"use client";

import React, { useState } from "react";
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
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Swal from "sweetalert2";

interface SubmitReviewModalProps {
  open: boolean;
  onClose: () => void;
  paper: any;
  onSuccess: () => void;
}

export const SubmitReviewModal = ({ open, onClose, paper, onSuccess }: SubmitReviewModalProps) => {
  const [recommendation, setRecommendation] = useState("Minor Revision");
  const [commentsToAuthor, setCommentsToAuthor] = useState("");
  const [commentsToEditor, setCommentsToEditor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!paper) return null;

  const handleSubmit = async () => {
    if (!commentsToAuthor.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please provide Comments to the Author.",
        confirmButtonColor: "#004b23",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviewer/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperID: paper.paperID,
          commentsToAuthor,
          commentsToEditor,
          recommendation,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Review Submitted",
          text: "Thank you for completing this peer review report.",
          confirmButtonColor: "#004b23",
        });
        onSuccess();
        onClose();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit review");
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "An error occurred while saving your review.",
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
          width: { xs: "90%", md: "600px" },
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
              Submit Peer Review Report
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
              Manuscript: &quot;{paper.title}&quot;
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#aaa" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Evaluation Board */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ fontWeight: 700, color: "#333", mb: 1, fontSize: "14px" }}>
              My Recommendation <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              size="small"
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="Accept">Accept (Ready for publication)</MenuItem>
              <MenuItem value="Minor Revision">Minor Revision (Small corrections needed)</MenuItem>
              <MenuItem value="Major Revision">Major Revision (Significant corrections required)</MenuItem>
              <MenuItem value="Reject">Reject (Not suitable for publication)</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Comments to Author(s) *"
              multiline
              rows={4}
              placeholder="Provide constructive feedback, critical remarks, or suggestions for the authors..."
              value={commentsToAuthor}
              onChange={(e) => setCommentsToAuthor(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: "10px" }
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Confidential Comments to Editor & Associate Editor"
              multiline
              rows={3}
              placeholder="Private comments, concerns regarding ethics, duplication, or overall suitability..."
              value={commentsToEditor}
              onChange={(e) => setCommentsToEditor(e.target.value)}
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
            startIcon={<CheckCircleOutlineIcon />}
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
            Submit Review Report
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
