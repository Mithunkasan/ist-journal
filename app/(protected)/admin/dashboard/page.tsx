"use client";

import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Divider
} from "@mui/material";
import { 
  People, 
  Description, 
  CheckCircle, 
  Pending, 
  Assessment,
  GroupAdd
} from "@mui/icons-material";
import { motion } from "framer-motion";

import { useLanguage } from "@/lib/LanguageContext";
import SkeletonDashboard from "@/components/ui/SkeletonDashboard";

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}15`, color: color }}>
          {icon}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#333' }}>
          {value}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: '#666', fontWeight: 600 }}>
        {title}
      </Typography>
    </CardContent>
    <Box sx={{ height: 4, bgcolor: color }} />
  </Card>
);

const AdminDashboardHome = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubmissions: 0,
    pendingReviews: 0,
    publishedPapers: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/activities")
        ]);
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
        if (activitiesRes.ok) {
          const acts = await activitiesRes.json();
          setActivities(acts);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
        {t("admin.overview")}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title={t("admin.totalusers")} 
            value={stats.totalUsers} 
            icon={<People fontSize="large" />} 
            color="#2196f3" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title={t("admin.submissions")} 
            value={stats.totalSubmissions} 
            icon={<Description fontSize="large" />} 
            color="#004b23" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title={t("admin.pendingreviews")} 
            value={stats.pendingReviews} 
            icon={<Pending fontSize="large" />} 
            color="#ff9800" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title={t("admin.published")} 
            value={stats.publishedPapers} 
            icon={<CheckCircle fontSize="large" />} 
            color="#4caf50" 
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t("admin.recentactivities")}
              </Typography>
              <IconButton size="small">
                <Assessment />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {activities.length > 0 ? activities.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f0fdf4', color: '#004b23', height: 'fit-content' }}>
                    <GroupAdd />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {item.description} • {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                    </Typography>
                  </Box>
                </Box>
              )) : (
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {t("admin.noactivities")}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', bgcolor: '#004b23', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {t("admin.quickactions")}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              <button 
                onClick={() => window.location.href = '/admin/users/pending'}
                className="w-full text-left rtl:text-right p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/20 flex justify-between items-center"
              >
                <span>{t("admin.reviewusers")}</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{t("admin.actionneeded")}</span>
              </button>
              <button className="w-full text-left rtl:text-right p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/20">
                {t("admin.createannouncement")}
              </button>
              <button className="w-full text-left rtl:text-right p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/20">
                {t("admin.sysbackup")}
              </button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardHome;
