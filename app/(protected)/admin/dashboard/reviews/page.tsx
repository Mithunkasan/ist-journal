"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Search,
  FilterList,
  Visibility,
  Close,
  RateReview,
} from "@mui/icons-material";
import axios from "axios";
import { formatPaperId } from "@/lib/utils/utils";

interface ReviewData {
  id: string | number;
  paperID: number;
  paperTitle: string;
  reviewerId: string;
  reviewerName: string;
  commentsToAuthor?: string;
  commentsToEditor?: string;
  recommendation?: string;
  status: string; // INVITED, ACCEPTED, DECLINED, COMPLETED
  createdAt: string;
  updatedAt: string;
  deadline?: string;
}

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [orderBy, setOrderBy] = useState<keyof ReviewData>("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    document.title = "Review Management | IST Journal Admin Dashboard";
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property: keyof ReviewData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "DECLINED":
        return "error";
      case "ACCEPTED":
        return "info";
      case "INVITED":
      default:
        return "default";
    }
  };

  const getRecommendationColor = (recommendation?: string) => {
    if (!recommendation) return "default";
    switch (recommendation.toUpperCase()) {
      case "ACCEPT":
        return "success";
      case "MINOR_REVISION":
        return "info";
      case "MAJOR_REVISION":
        return "warning";
      case "REJECT":
        return "error";
      default:
        return "default";
    }
  };

  const formatRecommendation = (rec?: string) => {
    if (!rec) return "Pending";
    return rec.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Unique statuses for filter dropdown
  const uniqueStatuses = ["INVITED", "ACCEPTED", "DECLINED", "COMPLETED"];

  // Filtering
  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const matchesSearch =
        (rev.reviewerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rev.paperTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (formatPaperId(rev.paperID) || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rev.recommendation || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || rev.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchTerm, statusFilter]);

  // Sorting
  const sortedReviews = useMemo(() => {
    const comparator = (a: any, b: any) => {
      let valA = a[orderBy];
      let valB = b[orderBy];

      if (orderBy === "createdAt" || orderBy === "updatedAt" || orderBy === "deadline") {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    };

    return [...filteredReviews].sort(comparator);
  }, [filteredReviews, order, orderBy]);

  // Paginated data
  const paginatedReviews = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedReviews.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedReviews, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#004b23" }}>
          Review Management
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <TextField
          variant="outlined"
          placeholder="Search by ID, title, reviewer, recommendation..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{ flexGrow: 1, minWidth: "250px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#666" }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl variant="outlined" sx={{ minWidth: "200px" }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            label="Filter by Status"
            startAdornment={<FilterList sx={{ color: "#666", mr: 1 }} />}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            {uniqueStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Reviews Table */}
      <Paper sx={{ width: "100%", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#004b23" }} />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell
                      onClick={() => handleRequestSort("paperID")}
                      sx={{ fontWeight: 700, cursor: "pointer", "&:hover": { color: "#004b23" } }}
                    >
                      Paper ID {orderBy === "paperID" ? (order === "asc" ? "▲" : "▼") : ""}
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("paperTitle")}
                      sx={{ fontWeight: 700, cursor: "pointer", "&:hover": { color: "#004b23" } }}
                    >
                      Manuscript Title {orderBy === "paperTitle" ? (order === "asc" ? "▲" : "▼") : ""}
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("reviewerName")}
                      sx={{ fontWeight: 700, cursor: "pointer", "&:hover": { color: "#004b23" } }}
                    >
                      Reviewer {orderBy === "reviewerName" ? (order === "asc" ? "▲" : "▼") : ""}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Recommendation</TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("status")}
                      sx={{ fontWeight: 700, cursor: "pointer", "&:hover": { color: "#004b23" } }}
                    >
                      Status {orderBy === "status" ? (order === "asc" ? "▲" : "▼") : ""}
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("updatedAt")}
                      sx={{ fontWeight: 700, cursor: "pointer", "&:hover": { color: "#004b23" } }}
                    >
                      Last Activity {orderBy === "updatedAt" ? (order === "asc" ? "▲" : "▼") : ""}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <RateReview sx={{ fontSize: 40, color: "#cbd5e1", mb: 1 }} />
                        <Typography sx={{ color: "#64748b" }}>No review activities found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedReviews.map((rev) => (
                      <TableRow key={rev.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{formatPaperId(rev.paperID)}</TableCell>
                        <TableCell sx={{ fontWeight: 600, maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {rev.paperTitle}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{rev.reviewerName}</TableCell>
                        <TableCell>
                          <Chip
                            label={formatRecommendation(rev.recommendation)}
                            size="small"
                            color={getRecommendationColor(rev.recommendation) as any}
                            sx={{ fontWeight: 600, borderRadius: 1.5 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={rev.status.toUpperCase()}
                            size="small"
                            color={getStatusColor(rev.status) as any}
                            sx={{ fontWeight: 600, borderRadius: 1.5 }}
                          />
                        </TableCell>
                        <TableCell>{rev.updatedAt ? new Date(rev.updatedAt).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => setSelectedReview(rev)}
                            sx={{ color: "#004b23", "&:hover": { bgcolor: "rgba(0, 75, 35, 0.04)" } }}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={sortedReviews.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Review Details Dialog */}
      <Dialog
        open={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedReview && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0", p: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#004b23" }}>
                  Review Evaluation Details
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                  Manuscript ID: {formatPaperId(selectedReview.paperID)}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedReview(null)} size="small">
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {/* Paper Title */}
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                    Manuscript Title
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, color: "#0f172a" }}>
                    {selectedReview.paperTitle}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Reviewer Details */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                    Reviewer Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {selectedReview.reviewerName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: 0.5 }}>
                    Reviewer UUID: {selectedReview.reviewerId}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                    Evaluation Status & Recommendation
                  </Typography>
                  <Box sx={{ mt: 0.5, display: "flex", gap: 1 }}>
                    <Chip
                      label={`Status: ${selectedReview.status}`}
                      size="small"
                      color={getStatusColor(selectedReview.status) as any}
                      sx={{ fontWeight: 600, borderRadius: 1.5 }}
                    />
                    <Chip
                      label={`Rec: ${formatRecommendation(selectedReview.recommendation)}`}
                      size="small"
                      color={getRecommendationColor(selectedReview.recommendation) as any}
                      sx={{ fontWeight: 600, borderRadius: 1.5 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Timestamps */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                    Invited On
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {selectedReview.createdAt ? new Date(selectedReview.createdAt).toLocaleString() : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                    Last Updated / Completed
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {selectedReview.updatedAt ? new Date(selectedReview.updatedAt).toLocaleString() : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                    Deadline
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: selectedReview.deadline && new Date(selectedReview.deadline) < new Date() ? "error.main" : "text.primary" }}>
                    {selectedReview.deadline ? new Date(selectedReview.deadline).toLocaleDateString() : "No deadline set"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Comments to Author */}
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                    Comments For Author
                  </Typography>
                  <Paper sx={{ p: 2, mt: 1, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", minHeight: "80px" }}>
                    <Typography variant="body2" sx={{ color: "#334155", whiteSpace: "pre-line", fontStyle: selectedReview.commentsToAuthor ? "normal" : "italic" }}>
                      {selectedReview.commentsToAuthor || "No comments submitted for the author."}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Comments to Editor */}
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                    Confidential Comments For Editor
                  </Typography>
                  <Paper sx={{ p: 2, mt: 1, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", minHeight: "80px" }}>
                    <Typography variant="body2" sx={{ color: "#334155", whiteSpace: "pre-line", fontStyle: selectedReview.commentsToEditor ? "normal" : "italic" }}>
                      {selectedReview.commentsToEditor || "No confidential comments submitted for the editor."}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
              <Button
                variant="contained"
                onClick={() => setSelectedReview(null)}
                sx={{ bgcolor: "#004b23", "&:hover": { bgcolor: "#003318" }, borderRadius: 2, px: 3 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ReviewManagement;
