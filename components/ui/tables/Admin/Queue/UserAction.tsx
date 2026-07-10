"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Edit,
  Preview,
  Save,
  Close,
} from "@mui/icons-material";
import Swal from "sweetalert2";

import ViewPaper from "@/components/admin/viewPaper";
import { EditorDataType, JournalPaperType } from "@/types/Journals/author";
import { useAppDispatch } from "@/lib/hooks/redux";
import { updateEditorName } from "@/redux/actions/journalActions";
import { toast } from "react-hot-toast";

interface Props {
  params: any;
  setEditorAssignSelectOpen: Dispatch<SetStateAction<boolean>>;
  editorAssignSelectOpen: boolean;
  assignedEditor: string;
  isId?: number;
  createJournalData?: (
    journalData: JournalPaperType
  ) => (dispatch: any) => Promise<any>;
  updateSubmitPaper?: (
    paperID: number,
    updatedStatus: any
  ) => (dispatch: any) => Promise<any>;
  editorData: EditorDataType[];
  setLoading: (value: boolean) => void;
  loader: boolean;
  setAssignedEditor: Dispatch<SetStateAction<string>>;
  title?: string;
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const UserAction = ({
  params,
  createJournalData,
  setEditorAssignSelectOpen,
  isId,
  editorAssignSelectOpen,
  assignedEditor,
  editorData,
  loader,
  setLoading,
  updateSubmitPaper,
  setAssignedEditor,
  title,
}: Props) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [viewJournalPaper, setViewjournalPaper] = useState<JournalPaperType[]>([]);
  const [isLoadingSave, setIsLoadingSave] = useState<{ [key: number]: boolean }>({});

  const handleShowPaper = () => {
    setViewjournalPaper([params.row]);
    setOpen(!open);
  };


  const handleAssignEditor = async () => {
    setEditorAssignSelectOpen(!editorAssignSelectOpen);

  };
  

  const handleRejectPaper = async () => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the paper.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    const templateParams = {
      to_email: params?.row?.authorEmail,
      author_name: params?.row?.authorNames,
      paper_title: params?.row?.title,
    };

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: params?.row?.authorEmail,
          subject: `[IST Journal] Manuscript Evaluation: Rejected`,
          body: `Dear ${params?.row?.authorNames},\n\nWe regret to inform you that your manuscript titled "${params?.row?.title}" has been rejected after editorial review.\n\nThank you for submitting your work to our journal.\n\nBest regards,\nEditorial Office`,
          templateParams: { paperID: params?.row?.paperID }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to dispatch email");
      }

      toast.success("Email sent successfully!");
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      toast.error("An error occurred while sending email");
    }

    if (confirmed.isConfirmed) {
      try {
        const res = await fetch(`/api/reject/${params?.row?.id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete paper");

        Toast.fire({
          icon: "success",
          title: "Paper rejected and deleted successfully",
        });

        setLoading(true); // refresh your table
      } catch (err) {
        console.error(err);
        Toast.fire({
          icon: "error",
          title: "Error deleting paper",
        });
      }
    }
  };

  const editor1 = editorData?.find(
    (data: EditorDataType) => data.name === assignedEditor
  );
  const templateParams = {
    editor_email: editor1?.email,
    editor_name: editor1?.name,
  };

  const SaveEditorData = async (params: any) => {

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: editor1?.email,
          subject: `[IST Journal] New Manuscript Assignment`,
          body: `Dear EIC ${editor1?.name},\n\nYou have been assigned as the Editor-in-Chief for a new manuscript titled "${params?.row?.title || params?.title}".\n\nPlease log in to your Editor Portal to review the details and assign track associate editors.\n\nBest regards,\nJournal Administration`,
          templateParams: { editorName: editor1?.name }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to dispatch email");
      }

      toast.success("Email sent successfully!");
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      toast.error("An error occurred while sending email");
    }


    if (params.id !== isId) {
      Toast.fire({
        icon: "error",
        title: "Please select an editor before saving.",
      });
      return;
    }

    const editor = editorData?.filter(
      (data: EditorDataType) => data.name === assignedEditor
    );

    if (!editor || !editor[0]) {
      Toast.fire({
        icon: "error",
        title: "Editor not found.",
      });
      return;
    }

    const journalData: JournalPaperType = {
      userId: editor[0].id,
      type: params?.type,
      title: params?.title,
      keywords: params?.keywords,
      abstract: params?.abstract,
      paperUrl: params?.paperUrl,
      primaryDomain: params?.primaryDomain,
      secondaryDomain: params?.secondaryDomain,
      country: params?.country,
      authorNames: params?.authorNames,
      authorEmail: params?.authorEmail,
      editorName: assignedEditor,
      paperID: params?.paperID,
      isSubmitted: true,
      status: "ASSIGNED_TO_EDITOR",
    };

    const status = {
      status: "ASSIGNED_TO_EDITOR",
      isAssignedToEditor: true,
    };

    setIsLoadingSave((prevState) => ({ ...prevState, [params.id]: true }));

    if (title === "Submitted Papers" && createJournalData && updateSubmitPaper) {
      dispatch(createJournalData(journalData));
      dispatch(updateSubmitPaper(params.paperID, status));
      Toast.fire({
        icon: "success",
        title: "Editor Assigned Successfully",
      });
    }

    if (title === "Assigned Papers") {
      dispatch(updateEditorName(params.paperID, assignedEditor));
      Toast.fire({
        icon: "success",
        title: "Editor updated Successfully",
      });
    }

    setIsLoadingSave((prevState) => ({ ...prevState, [params.id]: false }));
    setLoading(true);
    setAssignedEditor("");
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="View Paper">
          <IconButton onClick={handleShowPaper}>
            <Preview />
          </IconButton>
        </Tooltip>

        {assignedEditor === "" && (
          <>
            <Tooltip title="Assign Editor">
              <span>
                <IconButton disabled={loader} onClick={handleAssignEditor}>
                  <Edit />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Reject Paper">
              <span>
                <IconButton disabled={loader} onClick={handleRejectPaper}>
                  <Close />
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}

        <div className="flex justify-center">
          <div className="text-[green] font-[700]">
            {isLoadingSave[params.id] ? (
              <CircularProgress sx={{ color: "#004b23" }} size={20} />
            ) : (
              <Tooltip title="Save Button">
                <IconButton
                  disabled={loader}
                  onClick={() => SaveEditorData(params.row)}
                >
                  <Save strokeWidth={1.25} />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
      </Box>

      {open && (
        <ViewPaper
          modalOpen={open}
          setModalOpen={setOpen}
          data={viewJournalPaper}
        />
      )}
    </>
  );
};

export default UserAction;
