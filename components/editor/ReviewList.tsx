import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  onGetAllEditors,
  onGetAllReviewer,
} from "@/redux/actions/journalActions";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useAppDispatch } from "@/lib/hooks/redux";

interface Column {
  id:
    | "name"
    | "email"
    | "password"
    | "qualification"
    | "university"
    | "joined"
    | "status"
    | "updatedAt";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center"; // Updated to allow all alignment options
  format?: (value: number) => string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Pad single digits with leading zero
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  return formattedDay + "/" + formattedMonth + "/" + year;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 100 },
  // {
  //   id: "password",
  //   label: "Password",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value: number) => value.toLocaleString("en-US"),
  // },
  {
    id: "qualification",
    label: "Qualification",
    minWidth: 170,
    align: "center",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "university",
    label: "University",
    minWidth: 200,
    align: "center",
    format: (value: number) => value.toFixed(2),
  },

  {
    id: "updatedAt",
    label: "Joined At",
    minWidth: 170,
    align: "center",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
    align: "center",
    format: (value: number) => value.toFixed(2),
  },
];

interface Data {
  name: string;
  email: string;
  // password: string;
  qualification: string;
  university: string;
  joined: string;
  status: string;
}

function createData(
  name: string,
  email: string,
  // password: string,
  qualification: string,
  university: string,
  joined: string,
  status: string
): Data {
  //   const density = population / size;
  return {
    name,
    email,
    // password,
    qualification,
    university,
    joined,
    status,
  };
}

export default function ReviewerList() {
  const dispatch = useAppDispatch();

  const reviewerData = useSelector(
    (state: any) => state?.reviewerSlice?.value?.reviewerData
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  React.useEffect(() => {
    dispatch(onGetAllReviewer());
  }, [dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
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
        List Of Reviewers
      </Typography>
      <Paper sx={{ maxWidth: "1000px", overflow: "hidden", marginTop: "20px" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      color: "#004b23",
                      fontWeight: 600,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewerData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row: any) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row?.code}
                    >
                      {columns?.map((column, index) => {
                        const value =
                          column.id === "updatedAt"
                            ? formatDate(row[column.id])
                            : row[column.id];
                        return (
                          <TableCell key={column?.id} align={column?.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 8, 10]}
          component="div"
          count={reviewerData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
