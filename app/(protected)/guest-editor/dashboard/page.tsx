"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, CircularProgress, Container } from "@mui/material";
import { GroupWork, RateReview, Assignment } from "@mui/icons-material";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks/redux";
import { onGetAllReviewer } from "@/redux/actions/journalActions";
import SkeletonDashboard from "@/components/ui/SkeletonDashboard";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const GuestEditorDashboard = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(onGetAllReviewer());
  }, [dispatch]);

  const fetchPapers = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);

    try {
      const response = await axios.get("/api/guest-editor/papers");
      setPapers(response.data);
    } catch (error) {
      console.error("Error fetching guest editor papers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers(true);
  }, [fetchPapers, flag]);

  if (loading) {
    return <SkeletonDashboard />;
  }

  const stats = [
    { title: "Total Assigned Papers", value: papers.length, icon: <Assignment sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: "Under Review", value: papers.filter((p: any) => p.status === 'UNDER_REVIEW').length, icon: <GroupWork sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: "Decision Pending", value: papers.filter((p: any) => p.status === 'DECISION_PENDING').length, icon: <RateReview sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        Guest Editor Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: stat.color, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 3, display: 'flex' }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>{stat.title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#004b23' }}>{stat.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Assigned Manuscripts Queue
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#004b23' }} />
          </Box>
        ) : (
          <JournalsTable 
            journalsPaper={papers} 
            titles="Guest_Assigned_Queue" 
            setFlag={setFlag} 
            flag={flag} 
            loadingSlice={loading}
          />
        )}
      </Paper>
    </Container>
  );
};

export default GuestEditorDashboard;
