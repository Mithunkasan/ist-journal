"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Box, Typography, Paper, Grid, CircularProgress, Tab, Tabs } from "@mui/material";
import { 
  CloudUpload, 
  ListAlt, 
  FactCheck, 
  History 
} from "@mui/icons-material";
import SkeletonDashboard from "@/components/ui/SkeletonDashboard";
import dynamic from "next/dynamic";
import axios from "axios";

import { useLanguage } from "@/lib/LanguageContext";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress sx={{ color: '#004b23' }} />
    </Box>
  )
});

const AuthorSubmitForm = dynamic(() => import("@/components/journals/AuthorSubmitForm"), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
      <CircularProgress sx={{ color: '#004b23' }} />
    </Box>
  )
});

const AuthorDashboard = () => {
  const { t } = useLanguage();
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const fetchPapers = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);

    try {
      const response = await axios.get("/api/author/papers");
      setPapers(response.data);
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers(true);
  }, [fetchPapers, flag]);

  const handleSubmitted = useCallback(
    (paper: any) => {
      setPapers((currentPapers: any[]) => {
        const withoutDuplicate = currentPapers.filter(
          (currentPaper: any) => currentPaper.paperID !== paper.paperID
        );

        return [paper, ...withoutDuplicate];
      });
      setActiveTab(0);
      void fetchPapers(false);
    },
    [fetchPapers]
  );

  const stats = useMemo(() => [
    { title: t("author.totalsubmissions"), value: papers.length, icon: <ListAlt sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: t("author.inreview"), value: papers.filter((p: any) => !['PUBLISHED', 'REJECTED'].includes(p.status)).length, icon: <FactCheck sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: t("author.published"), value: papers.filter((p: any) => p.status === 'PUBLISHED').length, icon: <CloudUpload sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: t("author.rejected"), value: papers.filter((p: any) => p.status === 'REJECTED').length, icon: <History sx={{ color: '#d32f2f' }} />, color: '#fef2f2' },
  ], [papers, t]);

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        {t("author.dashboard")}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: stat.color, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 3, display: 'flex' }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>{stat.title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: stat.title === t("author.rejected") ? '#d32f2f' : '#004b23' }}>{stat.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, borderRadius: 4, mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, val) => setActiveTab(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ 
            '& .MuiTabs-indicator': { bgcolor: '#004b23' },
            '& .Mui-selected': { color: '#004b23 !important' }
          }}
        >
          <Tab label={t("author.mysubmissions")} sx={{ fontWeight: 700 }} />
          <Tab label={t("author.submitnew")} sx={{ fontWeight: 700 }} />
        </Tabs>
      </Paper>

      <Box>
        {activeTab === 0 ? (
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              {t("author.yourpapers")}
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: '#004b23' }} />
              </Box>
            ) : (
              <JournalsTable 
                journalsPaper={papers} 
                titles="under_process" 
                setFlag={setFlag} 
                flag={flag} 
                loadingSlice={loading}
              />
            )}
          </Paper>
        ) : (
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
             <AuthorSubmitForm onSubmitted={handleSubmitted} redirectAfterSubmit={false} />
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default AuthorDashboard;
