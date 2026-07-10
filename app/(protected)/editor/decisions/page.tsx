"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const DecisionsPage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/editor/papers");
        // Filter papers that are ready for a decision (e.g. have a reviewer assigned or are pending decision)
        const decisionPapers = response.data.filter((p: any) => 
          p.isReviewerAssigned && 
          p.status !== "ACCEPTED" && 
          p.status !== "PUBLISHED" &&
          p.status !== "REJECTED"
        );
        setPapers(decisionPapers);
      } catch (error) {
        console.error("Error fetching papers for decision:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [flag]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        Decision Making
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Papers Awaiting Final Decision
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#004b23' }} />
          </Box>
        ) : (
          <JournalsTable 
            journalsPaper={papers} 
            titles="Editor_Decisions" 
            setFlag={setFlag} 
            flag={flag} 
            loadingSlice={loading}
          />
        )}
      </Paper>
    </Box>
  );
};

export default DecisionsPage;
