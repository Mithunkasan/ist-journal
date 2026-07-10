"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, CircularProgress, Button, Divider, Card, CardContent } from "@mui/material";
import { Assignment, RateReview, DoneAll, CheckCircle, Cancel } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";

import { useLanguage } from "@/lib/LanguageContext";
import SkeletonDashboard from "@/components/ui/SkeletonDashboard";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const ReviewerDashboard = () => {
  const { t } = useLanguage();
  const [papers, setPapers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [papersRes, invRes] = await Promise.all([
          axios.get("/api/reviewer/papers"),
          axios.get("/api/reviewer/invitations")
        ]);
        setPapers(papersRes.data);
        setInvitations(invRes.data);
      } catch (error) {
        console.error("Error fetching reviewer dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [flag]);

  if (loading) {
    return <SkeletonDashboard />;
  }

  const handleInvitationResponse = async (reviewID: number, decision: "ACCEPT" | "DECLINE") => {
    try {
      const response = await axios.post(`/api/reviewer/invitation/${reviewID}`, { decision });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: decision === "ACCEPT" ? t("reviewer.invitationaccepted") : t("reviewer.invitationdeclined"),
          text: decision === "ACCEPT" ? t("reviewer.invitationacceptedtext") : t("reviewer.invitationdeclinedtext"),
          confirmButtonColor: "#004b23",
        });
        setFlag(prev => !prev);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: t("reviewer.actionfailed"),
        text: t("reviewer.actionfailedtext"),
        confirmButtonColor: "#d32f2f"
      });
    }
  };

  const stats = [
    { title: t("reviewer.activereviews"), value: papers.length, icon: <Assignment sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: t("reviewer.pendinginvitations"), value: invitations.length, icon: <RateReview sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: t("reviewer.completedreviews"), value: papers.filter((p: any) => p.status === 'ACCEPTED' || p.status === 'REJECTED' || p.status === 'PUBLISHED').length, icon: <DoneAll sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        {t("reviewer.dashboard")}
      </Typography>

      {/* Stats Board */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: stat.color, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
              <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 3, display: 'flex', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
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

      {/* 1. Review Invitations section */}
      {invitations.length > 0 && (
        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4, borderLeft: '5px solid #004b23' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#004b23', mb: 3 }}>
            ✉️ {t("reviewer.invitations")} ({invitations.length})
          </Typography>
          <Grid container spacing={3}>
            {invitations.map((inv: any) => (
              <Grid item xs={12} key={inv.reviewID}>
                <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0', bgcolor: '#fafafa' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        {inv.title}
                      </Typography>
                      <Typography variant="body2" sx={{ bgcolor: '#f1f5f9', color: '#475569', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '12px' }}>
                        {t("reviewer.category")}: {inv.category}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {inv.abstract && inv.abstract.length > 280 ? `${inv.abstract.slice(0, 280)}...` : inv.abstract}
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e65100' }}>
                        ⏳ {t("reviewer.due")}: {new Date(inv.deadline).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                          variant="contained" 
                          color="success" 
                          startIcon={<CheckCircle />}
                          onClick={() => handleInvitationResponse(inv.reviewID, "ACCEPT")}
                          sx={{
                            bgcolor: '#004b23',
                            '&:hover': { bgcolor: '#003d1c' },
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2
                          }}
                        >
                          {t("reviewer.accept")}
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          startIcon={<Cancel />}
                          onClick={() => handleInvitationResponse(inv.reviewID, "DECLINE")}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2
                          }}
                        >
                          {t("reviewer.decline")}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* 2. Active Review queue */}
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          {t("reviewer.assignedpapers")}
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#004b23' }} />
          </Box>
        ) : (
          <JournalsTable 
            journalsPaper={papers} 
            titles="Reviewer_Queue" 
            setFlag={setFlag} 
            flag={flag} 
            loadingSlice={loading}
          />
        )}
      </Paper>
    </Box>
  );
};

export default ReviewerDashboard;
