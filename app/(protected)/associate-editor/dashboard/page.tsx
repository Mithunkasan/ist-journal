"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import { 
  GroupWork, 
  RateReview, 
  Assignment 
} from "@mui/icons-material";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks/redux";
import { onGetAllReviewer } from "@/redux/actions/journalActions";

import { useLanguage } from "@/lib/LanguageContext";
import SkeletonDashboard from "@/components/ui/SkeletonDashboard";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const AssociateEditorDashboard = () => {
  const { t } = useLanguage();
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [papers, setPapers] = useState([]);
  const [screeningPapers, setScreeningPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(onGetAllReviewer());
  }, [dispatch]);

  const fetchPapers = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);

    try {
      const [allSubmissionsRes, papersRes, screeningRes] = await Promise.all([
        axios.get("/api/editor/papers"),
        axios.get("/api/associate-editor/papers"),
        axios.get("/api/associate-editor/screening")
      ]);
      setAllSubmissions(allSubmissionsRes.data);
      setPapers(papersRes.data);
      setScreeningPapers(screeningRes.data);
    } catch (error) {
      console.error("Error fetching papers:", error);
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
    { title: "All Submissions", value: allSubmissions.length, icon: <Assignment sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: t("ae.mytrack"), value: papers.length, icon: <GroupWork sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: t("ae.underreview"), value: papers.filter((p: any) => p.isReviewerAssigned).length, icon: <RateReview sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        {t("ae.dashboard")}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: stat.color, display: 'flex', alignItems: 'center', gap: 2 }}>
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

      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Initial Screening Queue
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#004b23' }} />
          </Box>
        ) : (
          <JournalsTable 
            journalsPaper={screeningPapers} 
            titles="Associate_Screening" 
            setFlag={setFlag} 
            flag={flag} 
            loadingSlice={loading}
          />
        )}
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          {t("ae.mytrack")}
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#004b23' }} />
          </Box>
        ) : (
          <JournalsTable 
            journalsPaper={papers} 
            titles="AE_Track_Queue" 
            setFlag={setFlag} 
            flag={flag} 
            loadingSlice={loading}
          />
        )}
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          All Submissions
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#004b23' }} />
          </Box>
        ) : (
          <JournalsTable 
            journalsPaper={allSubmissions} 
            titles="Associate_All_Submissions" 
            setFlag={setFlag} 
            flag={flag} 
            loadingSlice={loading}
          />
        )}
      </Paper>
    </Box>
  );
};

export default AssociateEditorDashboard;
