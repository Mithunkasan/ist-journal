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
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Select,
  MenuItem,
  Slider,
  Grid,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Swal from "sweetalert2";

interface ScreeningCheckModalProps {
  open: boolean;
  onClose: () => void;
  paper: any;
  onSuccess: () => void;
}

export const ScreeningCheckModal = ({ open, onClose, paper, onSuccess }: ScreeningCheckModalProps) => {
  const [scopeMatch, setScopeMatch] = useState("Good Match");
  const [plagiarismRate, setPlagiarismRate] = useState(10);
  const [formattingStatus, setFormattingStatus] = useState("Passed");
  const [ethicalCompliance, setEthicalCompliance] = useState("Compliant");
  const [paperQuality, setPaperQuality] = useState("Acceptable Quality");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!paper) return null;

  const handleAction = async (decision: "FORWARD" | "RETURN" | "REJECT") => {
    if ((decision === "RETURN" || decision === "REJECT") && !comments.trim()) {
      Swal.fire({
        icon: "error",
        title: "Comments Required",
        text: "Please provide comments/reasons for sending back or rejecting the paper.",
        confirmButtonColor: "#004b23",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/associate-editor/screening/${paper.paperID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision,
          scopeMatch,
          plagiarismRate,
          formattingStatus,
          ethicalCompliance,
          paperQuality,
          comments,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Decision Submitted",
          text: `The editorial check decision has been processed.`,
          confirmButtonColor: "#004b23",
        });
        onSuccess();
        onClose();
      } else {
        throw new Error("Failed to process screening check");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: "An error occurred while saving the editorial screening check.",
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
          width: { xs: "90%", md: "650px" },
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
              Initial Editorial Check
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
              ID: {paper.paperID} | Title: &quot;{paper.title}&quot;
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#aaa" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Evaluation Board */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* 1. Scope Matching */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ fontWeight: 700, color: "#333", mb: 1, fontSize: "14px" }}>
                Journal Scope Match
              </FormLabel>
              <Select
                value={scopeMatch}
                onChange={(e) => setScopeMatch(e.target.value)}
                size="small"
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="Excellent Match">Excellent Match</MenuItem>
                <MenuItem value="Good Match">Good Match</MenuItem>
                <MenuItem value="Borderline Match">Borderline Match</MenuItem>
                <MenuItem value="Out of Scope">Out of Scope</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* 2. Basic Quality */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ fontWeight: 700, color: "#333", mb: 1, fontSize: "14px" }}>
                Basic Paper Quality Check
              </FormLabel>
              <Select
                value={paperQuality}
                onChange={(e) => setPaperQuality(e.target.value)}
                size="small"
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="High Quality">High Quality</MenuItem>
                <MenuItem value="Acceptable Quality">Acceptable Quality</MenuItem>
                <MenuItem value="Poor Quality">Poor Quality</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* 3. Plagiarism Rate */}
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#333", mb: 1 }}>
              Plagiarism Verification (Similarity Index: {plagiarismRate}%)
            </Typography>
            <Slider
              value={plagiarismRate}
              onChange={(_e, val) => setPlagiarismRate(val as number)}
              valueLabelDisplay="auto"
              step={1}
              marks={[
                { value: 0, label: "0%" },
                { value: 15, label: "15% (Threshold)" },
                { value: 50, label: "50%" },
                { value: 100, label: "100%" }
              ]}
              sx={{
                color: plagiarismRate <= 15 ? "#004b23" : plagiarismRate <= 30 ? "#f57c00" : "#d32f2f",
                mx: 1
              }}
            />
          </Grid>

          {/* 4. Formatting Validation */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ fontWeight: 700, color: "#333", mb: 1, fontSize: "14px" }}>
                Formatting Validation
              </FormLabel>
              <Select
                value={formattingStatus}
                onChange={(e) => setFormattingStatus(e.target.value)}
                size="small"
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="Passed">Formatting Passed</MenuItem>
                <MenuItem value="Minor Issues">Minor Formatting Issues</MenuItem>
                <MenuItem value="Correction Required">Formatting Correction Required</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* 5. Ethical Compliance */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ fontWeight: 700, color: "#333", mb: 1, fontSize: "14px" }}>
                Ethical Compliance
              </FormLabel>
              <Select
                value={ethicalCompliance}
                onChange={(e) => setEthicalCompliance(e.target.value)}
                size="small"
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="Compliant">Ethics Compliant</MenuItem>
                <MenuItem value="Suspect">Ethics Suspect / Check</MenuItem>
                <MenuItem value="Non-compliant">Non-compliant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Comments Box */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Evaluation Comments / Correction Guidelines"
            multiline
            rows={3}
            placeholder="Provide reasons for rejection, guidelines for formatting corrections, or editorial remarks..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: { borderRadius: "10px" }
            }}
          />
        </Box>

        {/* Action Panel */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, justifyItems: "flex-end" }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleOutlineIcon />}
            disabled={isSubmitting}
            onClick={() => handleAction("FORWARD")}
            sx={{
              flexGrow: 1,
              bgcolor: "#004b23",
              '&:hover': { bgcolor: "#003d1c" },
              borderRadius: "8px",
              py: 1
            }}
          >
            Forward to Review
          </Button>
          
          <Button
            variant="contained"
            color="warning"
            startIcon={<WarningAmberIcon />}
            disabled={isSubmitting}
            onClick={() => handleAction("RETURN")}
            sx={{
              flexGrow: 1,
              bgcolor: "#e65100",
              '&:hover': { bgcolor: "#cc4100" },
              borderRadius: "8px",
              py: 1
            }}
          >
            Send Back (Format Correction)
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<ErrorOutlineIcon />}
            disabled={isSubmitting}
            onClick={() => handleAction("REJECT")}
            sx={{
              flexGrow: 1,
              bgcolor: "#d32f2f",
              '&:hover': { bgcolor: "#b71c1c" },
              borderRadius: "8px",
              py: 1
            }}
          >
            Desk Reject
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
