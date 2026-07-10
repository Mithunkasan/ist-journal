"use client";
import { Check, Save } from "@mui/icons-material";
import { Box, CircularProgress, Fab, Tooltip } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { Delete, Edit, Preview } from "@mui/icons-material";

type Props = {
  params: any;
  rowId: any;
  setRowId: any;
};

const UserAction = ({ params, rowId, setRowId }: Props) => {
  //   console.log(params, "mmmaaammmae");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleShowPaper = () => {};

  const handleSubmit = async () => {};
  return (
    // <Box sx={{ m: 1, position: "relative" }}>
    //   {success ? (
    //     <Fab
    //       color="primary"
    //       sx={{
    //         width: 40,
    //         height: 40,
    //         bgcolor: green[500],
    //         "&hover": {
    //           bgcolor: green[700],
    //         },
    //       }}
    //     >
    //       <Check />{" "}
    //     </Fab>
    //   ) : (
    //     <Fab
    //       color="primary"
    //       sx={{
    //         width: 40,
    //         height: 40,
    //       }}
    //       disabled={loading}
    //       onClick={handleSubmit}
    //     >
    //       <Save />{" "}
    //     </Fab>
    //   )}

    //   {loading && (
    //     <CircularProgress
    //       size={52}
    //       sx={{
    //         color: green[500],
    //         position: "absolute",
    //         to: -5,
    //         left: -5,
    //         zIndex: 1,
    //       }}
    //     />
    //   )}
    // </Box>

    <Box>
      <Tooltip title="View room details">
        <IconButton onClick={handleShowPaper}>
          <Preview />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit this room">
        <IconButton onClick={() => {}}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete this room">
        <IconButton
        //   onClick={() => deleteRoom(params.row, currentUser, dispatch)}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default UserAction;
