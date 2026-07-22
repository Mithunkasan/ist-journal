"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Button
} from "@mui/material";
import {
  Description,
  RateReview,
  CheckCircle,
  HourglassEmpty,
  Pending,
  KeyboardBackspace
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import axios from "axios";
import { formatPaperId } from "@/lib/utils/utils";

interface PaperData {
  id: number;
  paperID: number;
  type: string;
  title: string;
  abstract: string;
  paperUrl: string;
  authorNames: string;
  authorEmail: string;
  status: string;
  isReviewerAssigned: boolean;
  reviewers: any[];
  createdAt: string;
  updatedAt: string;
  category?: string;
}

const SubmissionTrackingPage = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState<PaperData[]>([]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.get("/api/admin/submission-tracking");
        setPapers(response.data);
      } catch (error) {
        console.error("Failed to fetch papers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
      case "PUBLISHED":
        return "success";
      case "REJECTED":
      case "WITHDRAWN":
        return "error";
      case "UNDER_REVIEW_BY_REVIEWER":
      case "UNDER_EDITOR_REVIEW":
        return "warning";
      default:
        return "primary";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "SUBMITTED" || status === "ASSIGNED_TO_EDITOR" || status === "EDITOR_SCREENING") {
      return "Paper Submitted";
    }
    return status ? status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : "";
  };

  // Stats calculation
  const totalSubmissions = papers.length;
  const inReview = papers.filter(p => p.status === "UNDER_REVIEW_BY_REVIEWER" || p.status === "UNDER_EDITOR_REVIEW" || p.status === "REVIEWER_ASSIGNED").length;
  const accepted = papers.filter(p => p.status === "ACCEPTED" || p.status === "PUBLISHED").length;
  const pending = papers.filter(p => p.status === "SUBMITTED" || p.status === "ASSIGNED_TO_EDITOR").length;

  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      <Box sx={{ p: 1 }}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] mb-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={() => router.back()}
        >
          <KeyboardBackspace />
          Back
        </button>

        <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', mb: 4 }}>
          Submission Tracking Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Description sx={{ color: '#2196f3', fontSize: 40 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{totalSubmissions}</Typography>
                </Box>
                <Typography variant="subtitle2" color="textSecondary">Total Submissions</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Pending sx={{ color: '#ff9800', fontSize: 40 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{inReview}</Typography>
                </Box>
                <Typography variant="subtitle2" color="textSecondary">Under Review</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <CheckCircle sx={{ color: '#4caf50', fontSize: 40 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{accepted}</Typography>
                </Box>
                <Typography variant="subtitle2" color="textSecondary">Accepted & Published</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <HourglassEmpty sx={{ color: '#9c27b0', fontSize: 40 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{pending}</Typography>
                </Box>
                <Typography variant="subtitle2" color="textSecondary">Pending Decision</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ width: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
              bgcolor: '#f8fafc',
              '& .MuiTab-root': { fontWeight: 600, py: 2 }
            }}
          >
            <Tab label="All Submissions" />
            <Tab label="Review Activities" />
          </Tabs>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#004b23' }} />
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <TableContainer>
                  <Table>
                     <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Paper ID</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Authors</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Category/Type</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Submission Date</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Last Updated</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {papers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">No submissions found</TableCell>
                        </TableRow>
                      ) : (
                        papers.map((paper) => (
                          <TableRow key={paper.id} hover>
                            <TableCell>{formatPaperId(paper.paperID)}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{paper.title}</TableCell>
                            <TableCell>{paper.authorNames || paper.authorEmail}</TableCell>
                            <TableCell>
                              <Typography variant="body2">{paper.category || "General"}</Typography>
                              <Typography variant="caption" color="textSecondary">{paper.type}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getStatusLabel(paper.status)}
                                size="small"
                                color={getStatusColor(paper.status) as any}
                                sx={{ fontWeight: 600, borderRadius: 1.5 }}
                              />
                            </TableCell>
                            <TableCell>{paper.createdAt ? new Date(paper.createdAt).toLocaleString() : "N/A"}</TableCell>
                            <TableCell>{new Date(paper.updatedAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {tabValue === 1 && (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Paper ID</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Reviewer Assigned</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Assigned Reviewers</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Workflow Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Last Activity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {papers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">No review activities found</TableCell>
                        </TableRow>
                      ) : (
                        papers.map((paper) => (
                          <TableRow key={paper.id} hover>
                            <TableCell>{formatPaperId(paper.paperID)}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{paper.title}</TableCell>
                            <TableCell>
                              <Chip
                                label={paper.isReviewerAssigned ? "YES" : "NO"}
                                color={paper.isReviewerAssigned ? "success" : "default"}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              {paper.reviewers && paper.reviewers.length > 0 ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {paper.reviewers.map((rev: any, index: number) => (
                                    <Chip key={index} label={rev.name || rev.email} size="small" variant="outlined" />
                                  ))}
                                </Box>
                              ) : (
                                <Typography variant="body2" color="textSecondary">None Assigned</Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getStatusLabel(paper.status)}
                                size="small"
                                color={getStatusColor(paper.status) as any}
                                sx={{ fontWeight: 600, borderRadius: 1.5 }}
                              />
                            </TableCell>
                            <TableCell>{new Date(paper.updatedAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </RoleGate>
  );
};

export default SubmissionTrackingPage;
