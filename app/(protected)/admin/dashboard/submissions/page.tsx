"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
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
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Description,
  FileOpen,
  Search,
  FilterList,
  Visibility,
  FileDownload,
  Link as LinkIcon,
  Close,
} from "@mui/icons-material";
import axios from "axios";
import { formatPaperId } from "@/lib/utils/utils";

interface SubmissionData {
  id: string | number;
  paperID: number;
  type: string;
  title: string;
  abstract: string;
  paperUrl: string;
  primaryDomain: string;
  secondaryDomain: string;
  country: string;
  authorNames: string;
  authorEmail: string;
  keywords: string;
  associateEditor?: string;
  isAssociatedEditorAssigned?: boolean;
  isReviewerAssigned?: boolean;
  status: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  coverLetterUrl?: string;
  supportingFilesUrl?: string;
  doi?: string;
  orcid?: string;
  reviewers?: Array<{ id: string; name: string; email?: string }>;
}

const SubmissionManagement = () => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [orderBy, setOrderBy] = useState<keyof SubmissionData>("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    document.title = "Submission Management | IST Journal Admin Dashboard";
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/submissions");
      setSubmissions(response.data);
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property: keyof SubmissionData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
      case "PUBLISHED":
        return "success";
      case "REJECTED":
      case "WITHDRAWN":
      case "DESK_REJECTED":
        return "error";
      case "UNDER_REVIEW":
      case "UNDER_REVIEW_BY_REVIEWER":
      case "UNDER_EDITOR_REVIEW":
      case "ASSOCIATE_EDITOR_REVIEW":
      case "UNDER_REVIEW_AGAIN":
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

  // Get unique list of statuses for the filter dropdown
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    submissions.forEach((sub) => {
      if (sub.status) statuses.add(sub.status);
    });
    return Array.from(statuses);
  }, [submissions]);

  // Filtering
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch =
        (sub.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.authorNames || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.authorEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (formatPaperId(sub.paperID) || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.associateEditor || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  // Sorting logic
  const sortedSubmissions = useMemo(() => {
    const comparator = (a: any, b: any) => {
      let valA = a[orderBy];
      let valB = b[orderBy];

      if (orderBy === "createdAt" || orderBy === "updatedAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    };

    return [...filteredSubmissions].sort(comparator);
  }, [filteredSubmissions, order, orderBy]);

  // Paginated data
  const paginatedSubmissions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedSubmissions.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedSubmissions, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      alert("No submissions to export.");
      return;
    }

    const headers = [
      "Paper ID",
      "Title",
      "Author Names",
      "Author Email",
      "Category",
      "Type",
      "Status",
      "Associate Editor",
      "Country",
      "Primary Domain",
      "Secondary Domain",
      "ORCID",
      "DOI",
      "Submission Date",
    ];

    const csvRows = [
      headers.join(","),
      ...filteredSubmissions.map((paper) => {
        const rowData = [
          formatPaperId(paper.paperID),
          `"${(paper.title || "").replace(/"/g, '""')}"`,
          `"${(paper.authorNames || "").replace(/"/g, '""')}"`,
          `"${(paper.authorEmail || "").replace(/"/g, '""')}"`,
          `"${(paper.category || "General").replace(/"/g, '""')}"`,
          `"${(paper.type || "").replace(/"/g, '""')}"`,
          paper.status || "",
          `"${(paper.associateEditor || "").replace(/"/g, '""')}"`,
          `"${(paper.country || "").replace(/"/g, '""')}"`,
          `"${(paper.primaryDomain || "").replace(/"/g, '""')}"`,
          `"${(paper.secondaryDomain || "").replace(/"/g, '""')}"`,
          paper.orcid || "",
          paper.doi || "",
          paper.createdAt ? new Date(paper.createdAt).toISOString() : "",
        ];
        return rowData.join(",");
      }),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23' }}>
          Submission Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileOpen />}
          onClick={handleExportCSV}
          sx={{
            color: '#004b23',
            borderColor: '#004b23',
            borderRadius: 2,
            borderWidth: 2,
            '&:hover': {
              borderColor: '#003318',
              bgcolor: 'rgba(0, 75, 35, 0.04)',
              borderWidth: 2,
            }
          }}
        >
          Export Submissions
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TextField
          variant="outlined"
          placeholder="Search by ID, title, author, editor..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{ flexGrow: 1, minWidth: '250px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#666' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl variant="outlined" sx={{ minWidth: '200px' }}>
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
            startAdornment={<FilterList sx={{ color: '#666', mr: 1 }} />}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            {uniqueStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {getStatusLabel(status)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Main Submissions Table */}
      <Paper sx={{ width: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#004b23' }} />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell
                      onClick={() => handleRequestSort("paperID")}
                      sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#004b23' } }}
                    >
                      Paper ID {orderBy === "paperID" ? (order === "asc" ? "▲" : "▼") : ""}
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("title")}
                      sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#004b23' } }}
                    >
                      Title {orderBy === "title" ? (order === "asc" ? "▲" : "▼") : ""}
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("authorNames")}
                      sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#004b23' } }}
                    >
                      Authors {orderBy === "authorNames" ? (order === "asc" ? "▲" : "▼") : ""}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category/Type</TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("status")}
                      sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#004b23' } }}
                    >
                      Status {orderBy === "status" ? (order === "asc" ? "▲" : "▼") : ""}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Assigned Associate Editor</TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("createdAt")}
                      sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#004b23' } }}
                    >
                      Date Submitted {orderBy === "createdAt" ? (order === "asc" ? "▲" : "▼") : ""}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSubmissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        <Description sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                        <Typography sx={{ color: '#64748b' }}>No submissions found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSubmissions.map((paper) => (
                      <TableRow key={paper.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{formatPaperId(paper.paperID)}</TableCell>
                        <TableCell sx={{ fontWeight: 600, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {paper.title}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{paper.authorNames}</Typography>
                          <Typography variant="caption" color="textSecondary">{paper.authorEmail}</Typography>
                        </TableCell>
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
                        <TableCell>
                          {paper.associateEditor ? (
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{paper.associateEditor}</Typography>
                          ) : (
                            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>Unassigned</Typography>
                          )}
                        </TableCell>
                        <TableCell>{paper.createdAt ? new Date(paper.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => setSelectedSubmission(paper)}
                            sx={{ color: '#004b23', '&:hover': { bgcolor: 'rgba(0, 75, 35, 0.04)' } }}
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
              count={sortedSubmissions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={Boolean(selectedSubmission)}
        onClose={() => setSelectedSubmission(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedSubmission && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', p: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#004b23' }}>
                  Submission Details
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Paper ID: {formatPaperId(selectedSubmission.paperID)}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedSubmission(null)} size="small">
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {/* Title */}
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Manuscript Title
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, color: '#0f172a' }}>
                    {selectedSubmission.title}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Abstract */}
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Abstract
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: '#334155', lineHeight: 1.6, textAlign: 'justify', whiteSpace: 'pre-line' }}>
                    {selectedSubmission.abstract}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Meta details */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Author Name & Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {selectedSubmission.authorNames}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {selectedSubmission.authorEmail}
                  </Typography>
                  {selectedSubmission.orcid && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                        <strong>ORCID:</strong> {selectedSubmission.orcid}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Category & Paper Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                    Category: {selectedSubmission.category || "General"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Type: {selectedSubmission.type}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Domains & Country
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    <strong>Primary:</strong> {selectedSubmission.primaryDomain}
                  </Typography>
                  {selectedSubmission.secondaryDomain && (
                    <Typography variant="body2">
                      <strong>Secondary:</strong> {selectedSubmission.secondaryDomain}
                    </Typography>
                  )}
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                    Country: {selectedSubmission.country}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Status & Keywords
                  </Typography>
                  <Box sx={{ mt: 0.5, mb: 1 }}>
                    <Chip
                      label={getStatusLabel(selectedSubmission.status)}
                      size="small"
                      color={getStatusColor(selectedSubmission.status) as any}
                      sx={{ fontWeight: 600, borderRadius: 1.5 }}
                    />
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    <strong>Keywords:</strong> {selectedSubmission.keywords}
                  </Typography>
                  {selectedSubmission.doi && (
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                      <strong>DOI:</strong> {selectedSubmission.doi}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Editorial and Reviewers */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Assigned Editorial Staff
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                    Associate Editor: {selectedSubmission.associateEditor || "None assigned"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Assigned Reviewers
                  </Typography>
                  {selectedSubmission.reviewers && selectedSubmission.reviewers.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {selectedSubmission.reviewers.map((rev) => (
                        <Chip
                          key={rev.id}
                          label={rev.name}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ mt: 0.5, color: '#64748b', fontStyle: 'italic' }}>
                      No reviewers assigned
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Attachments */}
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block', mb: 2 }}>
                    Manuscript Files & Attachments
                  </Typography>
                  <Grid container spacing={2}>
                    {/* PDF URL */}
                    {selectedSubmission.paperUrl && (
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<Description />}
                          href={selectedSubmission.paperUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#004b23', borderColor: '#004b23', borderRadius: 2 }}
                        >
                          View PDF Manuscript
                        </Button>
                      </Grid>
                    )}

                    {/* Cover Letter */}
                    {selectedSubmission.coverLetterUrl && (
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<LinkIcon />}
                          href={selectedSubmission.coverLetterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#004b23', borderColor: '#004b23', borderRadius: 2 }}
                        >
                          Cover Letter
                        </Button>
                      </Grid>
                    )}

                    {/* Supplementary Files */}
                    {selectedSubmission.supportingFilesUrl && (
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<LinkIcon />}
                          href={selectedSubmission.supportingFilesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#004b23', borderColor: '#004b23', borderRadius: 2 }}
                        >
                          Supporting Files
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
              <Button
                variant="contained"
                onClick={() => setSelectedSubmission(null)}
                sx={{ bgcolor: '#004b23', '&:hover': { bgcolor: '#003318' }, borderRadius: 2, px: 3 }}
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

export default SubmissionManagement;
