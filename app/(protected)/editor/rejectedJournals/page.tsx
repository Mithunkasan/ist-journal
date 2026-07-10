"use client";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

import CircularProgress from "@mui/material/CircularProgress";
import {
  onGetAllAssignedJournalRecords,
  onGetAllEditors,
  onGetAllRejectedJournalRecodrs,
} from "@/redux/actions/journalActions";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import ViewPaper from "@/components/admin/viewPaper";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Popover from "@mui/material/Popover";
import { useAppDispatch } from "@/lib/hooks/redux";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F1F4FD",
    color: "#004b23",
    fontSize: "15px",
    fontWeight: 600,
    fontFamily: "inherit",
  },
}));

const RejectedJournalPaper = () => {
  const router = useRouter();
  const session = useSession();
  const loadingSlice = useSelector(
    (state: any) => state.loaderSlice.value.isLoading
  );

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const opens = Boolean(anchorEl);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [filterJournalPaper, setFilterJournalPaper] = React.useState<any[]>([]);

  const [reviewerAssignedJournalPaper, setReviewerAssignedJounalPaper] =
    React.useState<any>([]);
  const [flag, setFlag] = React.useState(false);

  useEffect(() => {
    dispatch(onGetAllEditors());
  }, [dispatch]);

  useEffect(() => {
    const FetchAllAssignedJournalPaper = async () => {
      try {
        const allAssignedJournalPaper = await dispatch(
          onGetAllRejectedJournalRecodrs()
        );

        const filteredJournalByEditor = allAssignedJournalPaper?.filter(
          (data: any) => {
            return data?.editorName === session?.data?.user?.name;
          }
        );

        const filterJournalEditorAssignToReviewer =
          filteredJournalByEditor?.filter((data: any) => {
            return data?.status === "REJECTED";
          });

        setReviewerAssignedJounalPaper(filterJournalEditorAssignToReviewer);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    FetchAllAssignedJournalPaper();
  }, [dispatch, session]);

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <RoleGate allowedRole={UserRole.EDITOR}>
      <Container sx={{ marginBlock: "20px" }}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={handleBackButtonClick}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>
        <Typography
          sx={{
            marginBlock: "20px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#004b23",
            fontFamily: "inherit",
            textAlign: "center",
          }}
        >
          Rejected Papers
        </Typography>
        <JournalsTable
          journalsPaper={reviewerAssignedJournalPaper}
          flag={flag}
          setFlag={setFlag}
          loadingSlice={loadingSlice}
          titles="Rejected_Papers"
        />
        {/* <Paper sx={{ maxWidth: "100%", marginTop: "20px" }}>
          <TableContainer sx={{ maxHeight: 450 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Author Name(s)</StyledTableCell>
                  <StyledTableCell align="center">Paper Type</StyledTableCell>
                  <StyledTableCell align="center">Title</StyledTableCell>
                  <StyledTableCell align="center">View Paper</StyledTableCell>
                  <StyledTableCell align="center">Country</StyledTableCell>

                  <StyledTableCell align="center">
                    {" "}
                    Reviewers Name
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {" "}
                    Last Updated
                  </StyledTableCell>
                  <StyledTableCell align="center"> Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: 900,
                        padding: "20px",
                        fontSize: "16px",
                      }}
                    >
                      {" "}
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : reviewerAssignedJournalPaper?.length > 0 ? (
                  reviewerAssignedJournalPaper
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((row: any) => (
                      <TableRow
                        key={row?.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          sx={{ fontSize: "14px", textTransform: "capitalize" }}
                          component="th"
                          scope="row"
                        >
                          {row?.authorNames}
                        </TableCell>
                        <TableCell sx={{ fontSize: "14px" }} align="center">
                          {row?.type}
                        </TableCell>
                        <TableCell sx={{ fontSize: "14px" }} align="center">
                          <Typography
                            aria-owns={opens ? "mouse-over-popover" : undefined}
                            aria-haspopup="true"
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}
                          >
                            {truncateTitle(row?.title, 15)}{" "}
                          </Typography>
                          <Popover
                            id="mouse-over-popover"
                            sx={{
                              pointerEvents: "none",
                            }}
                            open={opens}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                          >
                            <Typography sx={{ p: 1 }}>{row?.title}</Typography>
                          </Popover>
                        </TableCell>
                        <TableCell sx={{ fontSize: "14px" }} align="center">
                          <Tooltip title="View Paper">
                            <IconButton onClick={() => handleViewDoc(row.id)}>
                              <RemoveRedEyeIcon style={{ fontSize: "18px" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ fontSize: "14px" }} align="center">
                          {row?.country}{" "}
                        </TableCell>
                        <TableCell sx={{ fontSize: "14px" }} align="center">
                          {row?.reviewers
                            ?.map((reviewers: any) => reviewers?.name)
                            .join(", ")}
                        </TableCell>

                        <TableCell sx={{ fontSize: "14px" }} align="center">
                          {convertToYYMMDD(row?.updatedAt)}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "14px", color: "red" }}
                          align="center"
                        >
                          {(row?.status).toUpperCase()}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell
                      style={{
                        fontWeight: 900,
                        padding: "20px",
                        fontSize: "16px",
                        justifyContent: "center",
                      }}
                    >
                      No Data Found!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 25]}
            component="div"
            count={reviewerAssignedJournalPaper?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper> */}
      </Container>
    </RoleGate>
  );
};

export default RejectedJournalPaper;
