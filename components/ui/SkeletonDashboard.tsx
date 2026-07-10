import React from "react";
import { Box, Paper, Grid, Skeleton } from "@mui/material";

export default function SkeletonDashboard() {
  return (
    <Box sx={{ width: "100%", animation: "fadeIn 0.5s ease-in-out" }}>
      {/* Page Title Skeleton */}
      <Skeleton 
        variant="text" 
        width={300} 
        height={50} 
        sx={{ mb: 4, borderRadius: 2, bgcolor: "rgba(0, 75, 35, 0.08)" }} 
      />

      {/* Stats Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 4, 
                bgcolor: "#f0fdf4", 
                display: "flex", 
                alignItems: "center", 
                gap: 2,
                boxShadow: "none",
                border: "1px solid rgba(0, 75, 35, 0.04)"
              }}
            >
              <Skeleton 
                variant="rounded" 
                width={50} 
                height={50} 
                sx={{ borderRadius: 3, bgcolor: "rgba(0, 75, 35, 0.08)" }} 
              />
              <Box sx={{ width: "60%" }}>
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="40%" height={30} sx={{ mt: 0.5 }} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tabs Skeleton (for dashboards that have tabs) */}
      <Paper sx={{ p: 1, borderRadius: 4, mb: 4, display: "flex", gap: 2, boxShadow: "none", border: "1px solid rgba(0,0,0,0.03)" }}>
        <Skeleton variant="rounded" width={120} height={35} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" width={120} height={35} sx={{ borderRadius: 2 }} />
      </Paper>

      {/* Main Content Area/Table Skeleton */}
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.02)" }}>
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 3 }} />
        
        {/* Table Rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Table Header */}
          <Box sx={{ display: "flex", gap: 2, pb: 1, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <Skeleton variant="text" width="20%" height={25} />
            <Skeleton variant="text" width="40%" height={25} />
            <Skeleton variant="text" width="15%" height={25} />
            <Skeleton variant="text" width="15%" height={25} />
            <Skeleton variant="text" width="10%" height={25} />
          </Box>
          
          {/* Table Row Skeletons */}
          {[1, 2, 3, 4, 5].map((row) => (
            <Box key={row} sx={{ display: "flex", gap: 2, alignItems: "center", py: 1 }}>
              <Skeleton variant="rounded" width="20%" height={20} />
              <Skeleton variant="rounded" width="40%" height={20} />
              <Skeleton variant="rounded" width="15%" height={20} />
              <Skeleton variant="rounded" width="15%" height={20} />
              <Skeleton variant="rounded" width="10%" height={20} />
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
