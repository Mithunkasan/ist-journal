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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
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

  // Quick Actions States
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementSubmitting, setAnnouncementSubmitting] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    titleAr: "",
    content: "",
    contentAr: ""
  });

  const [backupLoading, setBackupLoading] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const handleSystemBackup = async () => {
    setIsBackupOpen(true);
    setBackupLoading(true);
    try {
      const response = await fetch("/api/admin/backup");
      if (response.ok) {
        const data = await response.json();
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `system_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert("Failed to download system backup.");
      }
    } catch (error) {
      console.error("Backup error:", error);
      alert("An error occurred while generating system backup.");
    } finally {
      setBackupLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.content) {
      alert("Please fill in the required fields (Title and Content).");
      return;
    }
    setAnnouncementSubmitting(true);
    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementForm)
      });
      if (response.ok) {
        setIsAnnouncementOpen(false);
        setAnnouncementForm({ title: "", titleAr: "", content: "", contentAr: "" });
        alert("Announcement created successfully!");
      } else {
        alert("Failed to create announcement.");
      }
    } catch (error) {
      console.error("Announcement error:", error);
      alert("An error occurred while creating announcement.");
    } finally {
      setAnnouncementSubmitting(false);
    }
  };

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
              <button 
                onClick={() => setIsAnnouncementOpen(true)}
                className="w-full text-left rtl:text-right p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/20"
              >
                {t("admin.createannouncement")}
              </button>
              <button 
                onClick={handleSystemBackup}
                className="w-full text-left rtl:text-right p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/20"
              >
                {t("admin.sysbackup")}
              </button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Create Announcement Dialog */}
      <Dialog 
        open={isAnnouncementOpen} 
        onClose={() => setIsAnnouncementOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#004b23" }}>
          {t("admin.createannouncement") || "Create Announcement"}
        </DialogTitle>
        <form onSubmit={handleCreateAnnouncement}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title (English) *"
              required
              fullWidth
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              label="Title (Arabic)"
              fullWidth
              value={announcementForm.titleAr}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, titleAr: e.target.value }))}
            />
            <TextField
              label="Content (English) *"
              required
              fullWidth
              multiline
              rows={4}
              value={announcementForm.content}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
            />
            <TextField
              label="Content (Arabic)"
              fullWidth
              multiline
              rows={4}
              value={announcementForm.contentAr}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, contentAr: e.target.value }))}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setIsAnnouncementOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={announcementSubmitting}
              sx={{ bgcolor: "#004b23", "&:hover": { bgcolor: "#003b1c" } }}
            >
              {announcementSubmitting ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* System Backup Dialog */}
      <Dialog
        open={isBackupOpen}
        onClose={() => !backupLoading && setIsBackupOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#004b23" }}>
          {t("admin.sysbackup") || "System Backup"}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2 }}>
          {backupLoading ? (
            <>
              <CircularProgress sx={{ color: '#004b23' }} />
              <Typography variant="body1" sx={{ color: "#000" }}>Generating database backup dump...</Typography>
            </>
          ) : (
            <>
              <CheckCircle sx={{ color: 'green', fontSize: 60 }} />
              <Typography variant="body1" sx={{ color: "#000" }}>Backup completed & downloaded successfully!</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsBackupOpen(false)} disabled={backupLoading} variant="contained" sx={{ bgcolor: "#004b23", "&:hover": { bgcolor: "#003b1c" } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboardHome;
