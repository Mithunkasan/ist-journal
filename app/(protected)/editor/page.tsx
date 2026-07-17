"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Box, Typography, Paper, Grid, CircularProgress, Button } from "@mui/material";
import { 
  AssignmentInd, 
  LibraryBooks, 
  PendingActions, 
  CheckCircle
} from "@mui/icons-material";
import SkeletonDashboard from "@/components/ui/SkeletonDashboard";
import dynamic from "next/dynamic";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks/redux";
import { onGetAllReviewer } from "@/redux/actions/journalActions";
import { useRouter } from "next/navigation";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress sx={{ color: '#004b23' }} />
    </Box>
  )
});

const EditorDashboard = () => {
  const router = useRouter();
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
      const response = await axios.get("/api/editor/papers");
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

  const stats = useMemo(() => [
    { title: "Total Submissions", value: papers.length, icon: <LibraryBooks sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: "Unassigned", value: papers.filter((p: any) => !p.isReviewerAssigned).length, icon: <AssignmentInd sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: "Pending Decision", value: papers.filter((p: any) => p.status === 'DECISION_PENDING').length, icon: <PendingActions sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
    { title: "Accepted", value: papers.filter((p: any) => p.status === 'ACCEPTED').length, icon: <CheckCircle sx={{ color: '#004b23' }} />, color: '#f0fdf4' },
  ], [papers]);

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23' }}>
          Editor-in-Chief Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={() => router.push("/editor/guest-editor-register?role=guest_editor")}
            sx={{ bgcolor: '#004b23', '&:hover': { bgcolor: '#003318' }, borderRadius: 2 }}
          >
            Add Guest Editor
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push("/editor/associate-register")}
            sx={{ bgcolor: '#004b23', '&:hover': { bgcolor: '#003318' }, borderRadius: 2 }}
          >
            Add Sub Editor
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push("/editor/reviewerregister")}
            sx={{ bgcolor: '#004b23', '&:hover': { bgcolor: '#003318' }, borderRadius: 2 }}
          >
            Add Reviewer
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
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

      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Manage Submissions
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#004b23' }} />
          </Box>
        ) : (
          <JournalsTable 
            journalsPaper={papers} 
            titles="Editor_Queue" 
            setFlag={setFlag} 
            flag={flag} 
            loadingSlice={loading}
          />
        )}
      </Paper>
    </Box>
  );
};

export default EditorDashboard;
