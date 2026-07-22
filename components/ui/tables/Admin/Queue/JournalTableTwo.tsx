"use client";
import { EditorDataType, JournalPaperType } from "@/types/Journals/author";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import UserAction from "./UserAction";

interface PaginationModel {
  pageSize: number;
  page: number;
}

type JournalPaperTypes = {
  journalPaper: JournalPaperType[];
  editorData?: EditorDataType[];
  title: string;
  createJournalData?: (
    journalData: JournalPaperType
  ) => (dispatch: any) => Promise<any>;
  updateSubmitPaper?: (
    paperID: number,
    updatedStatus: any
  ) => (dispatch: any) => Promise<any>;
  setLoading: (value: boolean) => void;
  loader: boolean;
  isloading?: boolean;
};

const JournalTableTwo = ({
  journalPaper,
  editorData,
  title,
  createJournalData,
  setLoading,
  loader,
  updateSubmitPaper,
  isloading,
}: JournalPaperTypes) => {
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [rowId, setRowId] = useState();
  const [editorAssignSelectOpen, setEditorAssignSelectOpen] = useState(false);
  const [assignedEditor, setAssignedEditor] = useState("");
  const [isId, setIsId] = useState<number>();
  const [journals, setJournals] = useState<any>([]);

  const rows: any = journalPaper.map((data: any) => ({
    id: data?.id,
    paperID: data?.paperID,
    type: data?.type,
    title: data?.title,
    abstract: data?.abstract,
    paperUrl: data?.paperUrl,
    primaryDomain: data?.primaryDomain,
    secondaryDomain: data?.secondaryDomain,
    country: data?.country,
    authorNames: data?.authorNames,
    authorEmail: data?.authorEmail,
    keywords: data?.keywords,
    status: data?.status,
    howToKnow: data?.howToKnow,
    editorName: data?.editorName,
    isSubmitted: data?.isSubmitted,
    isAssigndtoEditor: data?.isAssigndToEditor ? "Yes" : "No",
    isReviewerAssigned: data?.isReviewerAssigned,
    updatedAt: data?.updatedAt,
    createdAt: data?.createdAt,
  }));
//Remove the unWanted keys to show in the dynamic table;

  function rm_string(ar_data: any, rm_data: string[]) {
    var ndata = [];
    for (let i = 0; i < ar_data.length; i++) {
      if (!rm_data.includes(ar_data[i])) {
        ndata.push(ar_data[i]);
      }
    }
    return ndata;
  }

  //Clean the table coloumn when the papaer is Assigned Papers

  useEffect(() => {
    if (title === "Assigned Papers") {
      const add = Object.keys(journalPaper[0] || {});
      setJournals(
        rm_string(add, [
          "reviewers",
          "user",
          "ispublished",
          "isEditable",
          "associateEditor",
          "isReviewerAssigned",
        ])
      );
    }
  }, [journalPaper, title]);


  //used to filter the coloum key is the title is submitted paper

  const columns: any = (
    title === "Submitted Papers"
      ? Object?.keys(journalPaper[0] || {})
      : journals
  )?.map((data: any) => {
    const isStatus = data === "status";
    return {
      field: data,
      headerName: data.replace(/([A-Z])/g, " $1").replace(/^./, (str: string) => str.toUpperCase()),
      width: 150,
      align: "left",
      headerAlign: "left",
      renderCell: isStatus
        ? (params: any) => {
            const val = params.value;
            if (val === "SUBMITTED" || val === "ASSIGNED_TO_EDITOR" || val === "EDITOR_SCREENING") {
              return "Paper Submitted";
            }
            return val ? val.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : "";
          }
        : undefined,
    };
  });

  columns.shift();



  const handleEditorChange = (id: any, editor: string) => {
    setAssignedEditor(editor);
  };

  //Handle the select and option in the save editor

  const renderEditorSelectCell = (params: any) => {
    const handleChange = (event: any) => {
      handleEditorChange(params.id, event.target.value);
      setIsId(params.id);
    };

    return (
      <Select
        value={
          ([params].some((data) => data.id === isId) && assignedEditor) || ""
        }
        onChange={handleChange}
        sx={{
          width: "210px",
          marginBottom: "10px",
          border: "none",
          outline: "none",
          height: "64px",
        }}
      >
        {editorData?.map((editor) => (
          <MenuItem key={editor.name} value={editor.name}>
            {editor.name}
          </MenuItem>
        ))}
      </Select>
    );
  };


  const assginEditors = {
    field: "AssignToEditor",
    headerName: "Assign to Editor",
    width: 240,
    renderCell: renderEditorSelectCell,
  };

  useEffect(() => {
    if (assignedEditor === "") {
      setEditorAssignSelectOpen(false);
    }
  }, [assignedEditor]);

  if (editorAssignSelectOpen && journalPaper.length > 0) {
    columns.push(assginEditors);
  }

  if (journalPaper.length > 0) {
    columns.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 180,
      cellClassName: "actions",
      renderCell: (params: any) => (
        
        <UserAction
          {...{
            params,
            createJournalData,
            setEditorAssignSelectOpen,
            isId,
            editorAssignSelectOpen,
            assignedEditor,
            editorData: editorData || [], // Provide default empty array if undefined
            setLoading,
            loader,
            updateSubmitPaper,
            setAssignedEditor,
            title,
          }}
        />
      ),
    });
  }

  return (
    <>
      {journalPaper?.length === 0 ? (
        <p
          className="flex items-center justify-center w-full h-[50vh]
        text-[#004b23] font-bold text-2xl"
        >
          {isloading === true ? (
            <CircularProgress size={40} />
          ) : (
            " No Data Found"
          )}
        </p>
      ) : (
        <Box sx={{ height: 400, width: "100%", marginBottom: "50px" }}>
          <Typography
            variant="h3"
            component={"h3"}
            sx={{
              marginBlock: "20px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#004b23",
              fontFamily: "inherit",
              textAlign: "center",
            }}
          >
            {title} {" "}
          </Typography>

          <DataGrid
            rowHeight={65}
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 20]}
            getRowSpacing={(params) => ({
              top: params.isFirstVisible ? 0 : 5,
              bottom: params.isLastVisible ? 0 : 5,
            })}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            processRowUpdate={(newRow: any) => {
              setRowId(newRow.id);
              return newRow;
            }}
            sx={{
              // border: "2px solid green",
              "& .css-1eecivq-MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-yrdy0g-MuiDataGrid-columnHeaderRow": {
                borderBottom: "2px solid #f5f5f5",
              },

              "&  .MuiDataGrid-withBorderColor": {
                border: "0.5px solid #f1f4fd",
                backgroundColor: "#f1f4fd",
              },
              "&  .MuiDataGrid-columnHeaderTitle": {
                color: "#004b23",
                fontWeight: 600,
                fontSize: "15px",
                textTransform: "capitalize",
                fontFamily: "inherit",
              },
            }}
          />
        </Box>
      )}
    </>
  );
};

export default JournalTableTwo;

// This should be your Props interface in UserAction component
interface Props {
  params: any;
  setEditorAssignSelectOpen: Dispatch<SetStateAction<boolean>>;
  editorAssignSelectOpen: boolean;
  assignedEditor: string;
  editorData: EditorDataType[]; // This expects a non-nullable array
  // ... other props
}
