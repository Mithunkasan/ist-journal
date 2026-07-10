"use client";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridRowSpacingParams,
  GridCellParams,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  Edit,
  JoinRight,
  Preview,
  ThirtyFpsSelectSharp,
  WidthFull,
} from "@mui/icons-material";
import ViewPaper from "@/components/admin/viewPaper";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MultipleSelect from "@/components/components/MultipleSelect";
import { SaveButton } from "@/components/components/saveButton";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { UpdateStatus } from "@/components/components/UpdateStatus";
import { useSelector } from "react-redux";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { CloudUploadIcon } from "lucide-react";
import UploadActions from "@/components/components/uploadAction";
import UploadButton from "@/components/components/UploadButton";
import ViewTxtPaper from "@/components/admin/viewTxtPaper";
import { JournalPaperType } from "@/types/Journals/author";
import { ScreeningCheckModal } from "@/components/associate/ScreeningCheckModal";
import { SubmitReviewModal } from "@/components/reviewer/SubmitReviewModal";
import { AERecommendationModal } from "@/components/associate/AERecommendationModal";
import { EICDecisionModal } from "@/components/editor/EICDecisionModal";
import Swal from "sweetalert2";

interface PaginationModel {
  pageSize: number;
  page: number;
}

const journalStatus = [
  { name: "Review1" },
  { name: "Review2" },
  { name: "Review3" },
  { name: "ACCEPTED" },
  { name: "REJECTED" },
];

const isEditable = [{ name: "Yes" }, { name: "No" }];

type Journals = {
  journalsPaper: any;
  setFlag: any;
  flag: any;
  loadingSlice: any;
  titles: string;
};

const JournalsTable = ({
  journalsPaper,
  setFlag,
  flag,
  loadingSlice,
  titles,
}: Journals) => {
  const router = useRouter();
  const session = useSession();

  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [rowId, setRowId] = useState();
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [values, setValues] = useState([]);
  const [filterPaper, setFilterPaper] = useState([]);
  const [reviewerNames, setReviewerNames] = useState<any>({});
  const [showSavebuton, setShowSavebuton] = useState(false);
  const [updateStatusSelect, setUpdateStatusSelect] = useState(false);
  const [status, setStatus] = useState([]);
  const [associateNames, setAssociateNmae] = useState([]);
  const [isEditables, setIsEditables] = useState([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewPaper, setSelectedReviewPaper] = useState<any>(null);
  const [isAERecomOpen, setIsAERecomOpen] = useState(false);
  const [selectedRecomPaper, setSelectedRecomPaper] = useState<any>(null);
  const [isEICModalOpen, setIsEICModalOpen] = useState(false);
  const [selectedEICPaper, setSelectedEICPaper] = useState<any>(null);
  const [isScreeningOpen, setIsScreeningOpen] = useState(false);
  const [selectedScreeningPaper, setSelectedScreeningPaper] = useState<any>(null);
  const [selectedAEs, setSelectedAEs] = useState<any>({});
  const [deadlines, setDeadlines] = useState<any>({});
  const [invitingStates, setInvitingStates] = useState<any>({});

  const reviewersData = useSelector(
    (state: any) => state?.reviewerSlice?.value?.reviewerData
  );

  const associate_name = useSelector(
    (names: any) => names?.associateSlice?.value?.associateData
  );

  function rm_string(ar_data: any, rm_data: any) {
    var ndata = [];
    for (let i = 0; i < ar_data?.length; i++) {
      if (!rm_data.includes(ar_data[i])) {
        ndata.push(ar_data[i]);
      }
    }
    return ndata;
  }

  useEffect(() => {
    if (titles === "Editor_Queue") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(
        rm_string(add, [
          "reviewers",
          "user",
          "ispublished",
          "isEditable",
          "associateEditor",
          "isReviewerAssigned",
          "paperUrl",
          "editorName",
          "isAssigndToEditor",
          "createdAt",
          "updatedAt",
          "primaryDomain",
          "secondaryDomain",
          "authorEmail",
          "txtUrl",
        ])
      );
    }
    if (titles === "Editor_Assign_Paper") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(
        rm_string(add, [
          "reviewers",
          "user",
          "ispublished",
          "isEditable",
          "associateEditor",
          "isReviewerAssigned",
          "paperUrl",
          "editorName",
          "isAssigndToEditor",
          "createdAt",
          "updatedAt",
          "primaryDomain",
          "secondaryDomain",
          "authorEmail",
          "txtUrl",
        ])
      );
    }
    if (titles === "Archive_Papers") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(
        rm_string(add, [
          "reviewers",
          "user",
          "paperUrl",
          "txtUrl",
          "createdAt",
          "updatedAt",
          "primaryDomain",
          "secondaryDomain",
          "authorEmail",
        ])
      );
    }
    if (titles === "Rejected_Papers") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(
        rm_string(add, [
          "reviewers",
          "user",
          "ispublished",
          "isEditable",
          "associateEditor",
          "isReviewerAssigned",
          "txtUrl",
          "paperUrl",
          "editorName",
          "isAssigndToEditor",
          "createdAt",
          "updatedAt",
          "authorEmail",
        ])
      );
    }
    if (titles === "under_process") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(rm_string(add, ["user", "txtUrl", "paperUrl", "editorName"]));
    }
    if (titles === "published_paper") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(rm_string(add, ["paperUrl", "txtUrl"]));
    }
    if (titles === "Reviewer_Queue" || titles === "Reviewer_Round_Two" || titles === "Editor_Decisions") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(
        rm_string(add, [
          "user",
          "ispublished",
          "isEditable",
          "associateEditor",
          "isReviewerAssigned",
          "txtUrl",
          "paperUrl",
          "editorName",
          "isAssigndToEditor",
          "createdAt",
          "updatedAt",
          "primaryDomain",
          "secondaryDomain",
          "authorEmail",
        ])
      );
    }
    if (titles === "Reviewer_Published") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(
        rm_string(add, [
          "user",
          "ispublished",
          "isEditable",
          "associateEditor",
          "isReviewerAssigned",
          "txtUrl",
          "paperUrl",
          "editorName",
          "isAssigndToEditor",
          "createdAt",
          "updatedAt",
          "primaryDomain",
          "secondaryDomain",
          "authorEmail",
        ])
      );
    }
    if (titles === "Reviewer_Rejected") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(
        rm_string(add, [
          "user",
          "ispublished",
          "isEditable",
          "associateEditor",
          "isReviewerAssigned",
          "txtUrl",
          "paperUrl",
          "editorName",
          "isAssigndToEditor",
          "createdAt",
          "updatedAt",
          "primaryDomain",
          "secondaryDomain",
          "authorEmail",
        ])
      );
    }
    if (titles === "Associate_Screening") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(
        rm_string(add, [
          "ispublished",
          "isEditable",
          "associateEditor",
          "isReviewerAssigned",
          "txtUrl",
          "isAssigndToEditor",
          "updatedAt",
          "howToKnow"
        ])
      );
    }
    if (titles === "AE_Track_Queue") {
      const add = journalsPaper && journalsPaper.length > 0 ? Object.keys(journalsPaper[0]) : [];
      setJournals(
        rm_string(add, [
          "reviewers",
          "user",
          "ispublished",
          "isEditable",
          "associateEditor",
          "isReviewerAssigned",
          "paperUrl",
          "editorName",
          "isAssigndToEditor",
          "createdAt",
          "updatedAt",
          "primaryDomain",
          "secondaryDomain",
          "authorEmail",
          "txtUrl",
          "supportingFilesUrl",
          "doi",
          "productionStep",
          "revisionComments",
          "responseLetterUrl"
        ])
      );
    }
  }, [journalsPaper, titles]);

  const rows: any = journalsPaper?.map((data: any) => ({
    rejectedPerson: data?.rejectedPerson,
    rejectedReasons: data?.rejectedReasons,
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
    editorName: data?.editorName,
    associateEditor: data?.associateEditor,
    keywords: data?.keywords,
    howToKnow: data?.howToKnow,
    isSubmitted: data?.isSubmitted ? "Yes" : "No",
    isReviewerAssigned: data?.isReviewerAssigned ? "Yes" : "No",
    isEditable: data?.isEditable ? "Yes" : "No",
    isAssigndToEditor: data?.isAssigndToEditor ? "Yes" : "No",
    isPublished: data?.isPublished ? "Yes" : "No",
    isAssociatedEditorAssigned: data?.isAssociatedEditorAssigned ? "Yes" : "No",
    reviewers: data?.reviewers
      ?.map((reviewers: any) => reviewers?.name)
      .join(", "),
    txtUrl: data?.txtUrl,
    updatedAt: data?.updatedAt,
    createdAt: data?.createdAt,
    volume: data?.volume,
    issue: data?.issue,
    status: data?.status,
    category: data?.category,
    supportingFilesUrl: data?.supportingFilesUrl,
    doi: data?.doi,
    productionStep: data?.productionStep,
  }));

  const columns: any = journals?.map((data: any) => ({
    field: data,
    headName: data,
    cellClassName: data,
    headerClassName: data,
    align: "center",
    headerAlign: "center",
  }));

  const columnExists = (columns: any, field: any) => {
    return columns?.some((column: any) => column?.field === field);
  };
  columns.shift();

  const handleShowPaper = (params: any) => {
    const paper = journalsPaper?.filter((data: JournalPaperType) => {
      return data?.paperID === params;
    });

    setFilterPaper(paper);
    setOpen(!open);
  };

  const handleShowTxt = (params: any) => {
    const paper = journalsPaper?.filter((data: any) => {
      return data?.paperID === params?.id;
    });
    setFilterPaper(paper);
    setOpens(!opens);
  };

  const updatePaper = (params: any) => {
    router.push(`/associate-editor/dashboard/submissions/updateForm/${params.row.paperID}`);
    setFlag(true);
  };

  const viewButton = (params: any) => {
    router.push(`/editor/submissions/detialView/${params}`);
  };

  if (titles === "Editor_Queue") {
    columns.push({
      field: "Detail View",
      type: "Detail View",
      headerName: "Detail View",
      headerAlign: "center",
      width: 100,
      align: "center",
      cellClassName: "details_view",
      renderCell: (params: any) => (
        <>
          <div className=" flex justify-center text-[17px]">
            <button
              className="text-[green] font-[600] hover:brightness-150 "
              onClick={() => viewButton(params.id)}
            >
              View
            </button>
          </div>
        </>
      ),
    });
  }

  if (titles === "Editor_Assign_Paper" || titles === "Editor_Decisions") {
    columns.splice(columns?.length / 2 + 2, 0, {
      field: "View",
      type: "View",
      headerName: "View",
      headerAlign: "center",
      width: 100,
      align: "center",
      cellClassName: "View",
      renderCell: (params: any) => (
        <Box>
          <Tooltip title="View review details">
            <IconButton onClick={() => handleShowTxt(params.row)}>
              <VisibilityRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    });
  }

  if (titles === "Editor_Assign_Paper") {
    columns.push({
      field: "Assigned Reviewers",
      headerName: "Assigned Reviewers",
      headerAlign: "center",
      width: 220,
      align: "center",
      renderCell: (params: any) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#004b23", width: "100%", textAlign: "center" }}>
          {params.row.reviewers || "Not assigned"}
        </Typography>
      ),
    });

    columns.push({
      field: "Select Reviewers",
      headerName: "Select Reviewers",
      headerAlign: "center",
      width: 280,
      renderCell: (params: any) => (
        <MultipleSelect
          params={params}
          reviewer={setReviewerNames}
          reviewerNames={reviewerNames}
        />
      ),
    });

    columns.push({
      field: "Review Deadline",
      headerName: "Review Deadline",
      headerAlign: "center",
      width: 160,
      renderCell: (params: any) => {
        const today = new Date().toISOString().split("T")[0];
        return (
          <input
            type="date"
            min={today}
            value={deadlines[params.row.paperID] || ""}
            onChange={(e) => {
              setDeadlines((prev: any) => ({ ...prev, [params.row.paperID]: e.target.value }));
            }}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "13px",
              width: "85%"
            }}
          />
        );
      }
    });

    columns.push({
      field: "Assign Reviewer",
      headerName: "Assign Reviewer",
      headerAlign: "center",
      width: 160,
      renderCell: (params: any) => {
        const paperID = params.row.paperID;
        const selected = reviewerNames[paperID] || [];
        const isInviting = invitingStates[paperID] || false;

        return (
          <Button
            variant="contained"
            size="small"
            disabled={selected.length === 0 || isInviting}
            onClick={async () => {
              setInvitingStates((prev: any) => ({ ...prev, [paperID]: true }));

              try {
                const mappedReviewers = selected
                  .map((name: string) => {
                    const revObj = reviewersData?.find((r: any) => r.name === name);
                    return revObj ? { id: revObj.id, name: revObj.name } : null;
                  })
                  .filter(Boolean);

                const response = await fetch("/api/associate-editor/invite-reviewers", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paperID,
                    paperTitle: params.row.title,
                    reviewers: mappedReviewers,
                    deadline: deadlines[paperID] || null
                  })
                });

                if (response.ok) {
                  Swal.fire({
                    icon: "success",
                    title: "Reviewer Assigned",
                    text: "The selected reviewer details have been saved for this paper.",
                    confirmButtonColor: "#004b23"
                  });
                  setReviewerNames((prev: any) => ({ ...prev, [paperID]: [] }));
                  setFlag((prev: boolean) => !prev);
                } else {
                  const message = await response.text();
                  throw new Error(message || "Failed to assign reviewers");
                }
              } catch (err) {
                console.error(err);
                Swal.fire({
                  icon: "error",
                  title: "Failed",
                  text: "An error occurred while assigning reviewers."
                });
              } finally {
                setInvitingStates((prev: any) => ({ ...prev, [paperID]: false }));
              }
            }}
            sx={{
              bgcolor: "#004b23",
              '&:hover': { bgcolor: "#003d1c" },
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 700
            }}
          >
            {isInviting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : "Assign Reviewer"}
          </Button>
        );
      }
    });
  }

  columns.splice(columns?.length / 2, 0, {
    field: "View Paper",
    type: "View Paper",
    headerName: "View Paper",
    headerAlign: "center",
    width: 100,
    align: "center",
    cellClassName: "View Paper",
    renderCell: (params: any) => (
      <Box>
        <Tooltip title="View room details">
          <IconButton onClick={() => handleShowPaper(params.id)}>
            <VisibilityRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  if (titles === "Associate_Screening") {
    columns.push({
      field: "Screening Action",
      headerName: "Screening Action",
      headerAlign: "center",
      width: 220,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button 
            variant="contained" 
            size="small" 
            color="success"
            onClick={() => {
              setSelectedScreeningPaper(params.row);
              setIsScreeningOpen(true);
            }}
            sx={{
              bgcolor: "#004b23",
              '&:hover': { bgcolor: "#003d1c" },
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600
            }}
          >
            Perform Screening Check
          </Button>
        </Box>
      )
    });
  }

  if (titles === "under_process") {
    columns.push({
      field: "Update ",
      type: "Update",
      headerName: "Update",
      headerAlign: "center",
      width: 100,
      align: "center",
      cellClassName: "update",
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Tooltip title="Update Paper">
            <IconButton
              onClick={() => {
                updatePaper(params);
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    });
  }

  if (titles === "Editor_Queue") {
    columns.push({
      field: "Assign Associate Editor",
      headerName: "Assign Associate Editor",
      headerAlign: "center",
      width: 250,
      renderCell: (params: any) => {
        const paperCategory = params.row.category || "";
        return (
          <select
            value={selectedAEs[params.row.paperID] !== undefined ? selectedAEs[params.row.paperID] : (params.row.associateEditor || "")}
            onChange={async (e) => {
              const selectedValue = e.target.value;
              setSelectedAEs((prev: any) => ({ ...prev, [params.row.paperID]: selectedValue }));
              
              try {
                // Update SubmittedJournals
                const response = await fetch(`/api/update-submit-paper/${params.row.paperID}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    data: {
                      associateEditor: selectedValue,
                      isAssociatedEditorAssigned: selectedValue ? true : false,
                      status: "UNDER_EDITOR_REVIEW",
                    }
                  })
                });
                
                if (response.ok) {
                  // Update AssignedJournals if exists
                  await fetch(`/api/update-assigned-journals/update-assigned-paper-status/${params.row.paperID}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      data: {
                        associateEditor: selectedValue,
                        isAssociatedEditorAssigned: selectedValue ? true : false,
                        status: "UNDER_EDITOR_REVIEW",
                      }
                    })
                  });

                  // Trigger a simulated notification email
                  const matchedAE = associate_name?.find((ae: any) => ae.name === selectedValue);
                  if (matchedAE && matchedAE.email) {
                    await fetch('/api/editor/notify-ae', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: matchedAE.email,
                        name: matchedAE.name,
                        paperTitle: params.row.title,
                        paperID: params.row.paperID,
                        category: paperCategory
                      })
                    });
                  }

                  Swal.fire({
                    icon: "success",
                    title: "Associate Editor Assigned",
                    text: `Paper assigned to ${selectedValue || "none"}.`,
                    timer: 1500,
                    showConfirmButton: false,
                  });
                  setFlag((prev: boolean) => !prev);
                }
              } catch (err) {
                console.error(err);
              }
            }}
            style={{
              width: "90%",
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #004b23",
              outline: "none",
              fontSize: "13px",
              fontWeight: 600,
              color: "#004b23",
              background: "#fff",
              cursor: "pointer"
            }}
          >
            <option value="">Select Associate Editor</option>
            {associate_name?.map((ae: any) => {
              const isMatch = ae.areaOfExpertise && paperCategory && 
                (ae.areaOfExpertise.toLowerCase().includes(paperCategory.toLowerCase()) ||
                 paperCategory.toLowerCase().includes(ae.areaOfExpertise.toLowerCase()));
              return (
                <option key={ae.id} value={ae.name}>
                  {ae.name} {ae.areaOfExpertise ? `(${ae.areaOfExpertise})` : ""} {isMatch ? "⭐ Match" : ""}
                </option>
              );
            })}
          </select>
        );
      }
    });
  }

  if (titles === "AE_Track_Queue") {
    columns.push({
      field: "Select Reviewers",
      headerName: "Select Reviewers",
      headerAlign: "center",
      width: 250,
      renderCell: (params: any) => (
        <MultipleSelect
          params={params}
          reviewer={setReviewerNames}
          reviewerNames={reviewerNames}
        />
      ),
    });

    columns.push({
      field: "Review Deadline",
      headerName: "Review Deadline",
      headerAlign: "center",
      width: 160,
      renderCell: (params: any) => {
        const today = new Date().toISOString().split("T")[0];
        return (
          <input
            type="date"
            min={today}
            value={deadlines[params.row.paperID] || ""}
            onChange={(e) => {
              setDeadlines((prev: any) => ({ ...prev, [params.row.paperID]: e.target.value }));
            }}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "13px",
              width: "85%"
            }}
          />
        );
      }
    });

    columns.push({
      field: "Invite Action",
      headerName: "Action",
      headerAlign: "center",
      width: 140,
      renderCell: (params: any) => {
        const paperID = params.row.paperID;
        const selected = reviewerNames[paperID] || [];
        const isInviting = invitingStates[paperID] || false;
        
        return (
          <Button
            variant="contained"
            size="small"
            disabled={selected.length === 0 || isInviting}
            onClick={async () => {
              if (selected.length === 0) {
                Swal.fire({
                  icon: "warning",
                  title: "Selection Alert",
                  text: "Please select at least one reviewer to proceed.",
                  confirmButtonColor: "#004b23"
                });
                return;
              }

              setInvitingStates((prev: any) => ({ ...prev, [paperID]: true }));
              
              try {
                const mappedReviewers = selected.map((name: string) => {
                  const revObj = reviewersData?.find((r: any) => r.name === name);
                  return { id: revObj?.id, name: name };
                });

                const response = await fetch("/api/associate-editor/invite-reviewers", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paperID: paperID,
                    paperTitle: params.row.title,
                    reviewers: mappedReviewers,
                    deadline: deadlines[paperID] || null
                  })
                });

                if (response.ok) {
                  Swal.fire({
                    icon: "success",
                    title: "Invitations Sent",
                    text: "Peer review invitations have been dispatched successfully.",
                    confirmButtonColor: "#004b23"
                  });
                  setFlag((prev: boolean) => !prev);
                } else {
                  throw new Error("Failed to invite reviewers");
                }
              } catch (err) {
                console.error(err);
                Swal.fire({
                  icon: "error",
                  title: "Failed",
                  text: "An error occurred while sending review invitations."
                });
              } finally {
                setInvitingStates((prev: any) => ({ ...prev, [paperID]: false }));
              }
            }}
            sx={{
              bgcolor: "#004b23",
              '&:hover': { bgcolor: "#003d1c" },
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 700
            }}
          >
            {isInviting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : "Invite Reviewers"}
          </Button>
        );
      }
    });

    columns.push({
      field: "AE Recommendation",
      headerName: "AE Recommendation",
      headerAlign: "center",
      width: 220,
      renderCell: (params: any) => {
        const status = params.row.status;
        
        if (status === "DECISION_PENDING") {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button 
                variant="contained" 
                size="small" 
                onClick={() => {
                  setSelectedRecomPaper(params.row);
                  setIsAERecomOpen(true);
                }}
                sx={{
                  bgcolor: "#7b1fa2",
                  '&:hover': { bgcolor: "#4a148c" },
                  borderRadius: "6px",
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#fff"
                }}
              >
                Submit AE Recommendation
              </Button>
            </Box>
          );
        } else if (status === "REVISIONS_REQUESTED" || status === "ACCEPTED" || status === "REJECTED" || status === "PUBLISHED") {
          return (
            <Typography variant="body2" sx={{ color: "green", fontWeight: 700, textAlign: "center", width: "100%" }}>
              Recommendation Submitted
            </Typography>
          );
        } else {
          return (
            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: "italic", textAlign: "center", width: "100%" }}>
              Awaiting Peer Reviews
            </Typography>
          );
        }
      }
    });
  }

  if (titles === "Editor_Decisions") {
    columns.push({
      field: "Final Decision",
      headerName: "Final Decision",
      headerAlign: "center",
      width: 220,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button 
            variant="contained" 
            size="small" 
            color="success"
            onClick={() => {
              setSelectedEICPaper(params.row);
              setIsEICModalOpen(true);
            }}
            sx={{
              bgcolor: "#004b23",
              '&:hover': { bgcolor: "#003d1c" },
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600
            }}
          >
            Make Final Decision
          </Button>
        </Box>
      )
    });
  }

  if (updateStatusSelect === true || titles === "Editor_Decisions") {
    columns.push({
      field: "Update Status",
      headerName: "Update Status",
      headerAlign: "center",
      cellClassName: "update_status",
      algin: "center",
      width: 150,

      renderCell: (params: any) => (
        <>
          <UpdateStatus
            params={params}
            setStateValue={setStatus}
            stateValue={status}
            selectValue={journalStatus}
          />
        </>
      ),
    });
  }

  if (
    Object?.values(status)?.filter((data: any) => data?.includes("ACCEPTED"))
      ?.length >= 1 &&
    updateStatusSelect === true
  ) {
    columns.push({
      field: "Associate Editor ",
      type: "Associate Editor",
      headerName: "Associate Editor",
      headerAlign: "center",
      width: 150,
      cellClassName: "associate_editor",
      algin: "center",
      renderCell: (params: any) => (
        <>
          <UpdateStatus
            params={params}
            stateValue={associateNames}
            setStateValue={setAssociateNmae}
            selectValue={associate_name}
          />
        </>
      ),
    });
  }
  if (
    Object?.values(status)?.filter((data: any) => data?.includes("ACCEPTED"))
      ?.length >= 1 &&
    updateStatusSelect === true
  ) {
    columns.push({
      field: "IsEditable ",
      type: "IsEditable",
      headerName: "IsEditable",
      headerAlign: "center",
      width: 150,
      cellClassName: "is_editable",
      algin: "center",
      renderCell: (params: any) => (
        <>
          <UpdateStatus
            params={params}
            stateValue={isEditables}
            setStateValue={setIsEditables}
            selectValue={isEditable}
          />
        </>
      ),
    });
  }

  // if (titles === "Editor_Assign_Paper") {
  //   columns.push({
  //     field: "Edit Status",
  //     headerName: "Edit Status",
  //     headerAlign: "center",
  //     headerClassName: "edit_statu_header",
  //     cellClassName: "edit_status",
  //     algin: "center",
  //     width: 120,

  //     renderCell: (params: any) => (
  //       <>
  //         <div
  //           className="text-[green] font-[700] flex justify-center h-[100%]"
  //           onClick={() => EditPaper(params.id)}
  //         >
  //           <Tooltip title="Update Status">
  //             <IconButton>
  //               <ModeEditOutlineIcon style={{ color: "gray" }} />
  //             </IconButton>
  //           </Tooltip>
  //         </div>
  //       </>
  //     ),
  //   });
  // }

  if (showSavebuton === true) {
    if (!columnExists(columns, "ActionBtn")) {
      columns.push({
        field: "ActionBtn",
        headerName: "Action",
        headerAlign: "center",
        cellClassName: "actionAssign",
        algin: "center",
        width: 120,

        renderCell: (params: any) => (
          <>
            <SaveButton
              titles={titles}
              status={status}
              setStatus={setStatus}
              params={params}
              setFlag={setFlag}
              flag={flag}
              selectedValues={status}
              paper={journalsPaper}
              editableValue={isEditables}
              associateNames={associateNames}
            />
          </>
        ),
      });
    }
  }

  if (titles === "Reviewer_Queue") {
    columns.push({
      field: "Submit Review",
      headerName: "Submit Review",
      headerAlign: "center",
      width: 200,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button 
            variant="contained" 
            size="small" 
            color="success"
            onClick={() => {
              setSelectedReviewPaper(params.row);
              setIsReviewModalOpen(true);
            }}
            sx={{
              bgcolor: "#004b23",
              '&:hover': { bgcolor: "#003d1c" },
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600
            }}
          >
            Submit Review Report
          </Button>
        </Box>
      )
    });
  }

  const EditPaper = (id: number) => {
    setUpdateStatusSelect(!updateStatusSelect);
    setShowSavebuton(!showSavebuton);
  };
  
  const handleScreeningDecision = async (row: any, decision: "FORWARD" | "RETURN") => {
    try {
      const response = await fetch(`/api/associate-editor/screening/${row.paperID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ decision, data: row }),
      });
      if (response.ok) {
        setFlag((prev: boolean) => !prev);
      } else {
        console.error("Failed to process screening decision");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <>
      {journalsPaper?.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
          }}
        >
          {loadingSlice === true ? <CircularProgress /> : "No Data Found"}
        </Typography>
      ) : (
        <Box
          sx={{
            height: 400,
            width: "100%",

            "& .css-yrdy0g-MuiDataGrid-columnHeaderRow": {
              background: " #e5e7f0 !important",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontFamily: "inherit",
              fontWeight: "600",
              textTransform: "capitalize",
              color: "#004b23",
              fontSize: "15px",
            },
            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: "rgb(220 238 215 / 88%) !important",
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: " rgb(220 238 215 / 88%) !important",
            },
            "& .Assign_To_Reviewers ": {
              padding: "0px !important",
            },
            "& .update_status": {
              padding: "0px !important",
            },
            "& .associate_editor ": {
              padding: "0px !important",
            },
            "& .is_editable ": {
              padding: "0px !important",
            },
            "& .MuiDataGrid-row": {
              margin: "0px !important",
            },
            "& .status  ": {
              fontWeight: "600 !important",
              color: "#004b23 !important",
            },
          }}
        >
          <DataGrid
            rowHeight={65}
            columns={columns}
            rows={rows}
            getRowId={(row: any) => row?.paperID}
            pagination
            pageSizeOptions={[5, 10, 25, 50, 100, 500]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowSpacing={(params: GridRowSpacingParams) => ({
              top: params.isFirstVisible ? 0 : 5,
              bottom: params.isLastVisible ? 0 : 5,
            })}
            processRowUpdate={(newRow: any) => {
              return newRow;
            }}
          />
        </Box>
      )}

      {open && (
        <ViewPaper modalOpen={open} setModalOpen={setOpen} data={filterPaper} />
      )}

      {opens && (
        <ViewTxtPaper
          modalOpen={opens}
          setModalOpen={setOpens}
          data={filterPaper}
        />
      )}

      {isScreeningOpen && (
        <ScreeningCheckModal
          open={isScreeningOpen}
          onClose={() => setIsScreeningOpen(false)}
          paper={selectedScreeningPaper}
          onSuccess={() => setFlag((prev: any) => !prev)}
        />
      )}

      {isReviewModalOpen && (
        <SubmitReviewModal
          open={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          paper={selectedReviewPaper}
          onSuccess={() => setFlag((prev: any) => !prev)}
        />
      )}

      {isAERecomOpen && (
        <AERecommendationModal
          open={isAERecomOpen}
          onClose={() => setIsAERecomOpen(false)}
          paper={selectedRecomPaper}
          onSuccess={() => setFlag((prev: any) => !prev)}
        />
      )}

      {isEICModalOpen && (
        <EICDecisionModal
          open={isEICModalOpen}
          onClose={() => setIsEICModalOpen(false)}
          paper={selectedEICPaper}
          onSuccess={() => setFlag((prev: any) => !prev)}
        />
      )}
    </>
  );
};

export default JournalsTable;
