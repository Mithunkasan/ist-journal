"use client";
import { useAppDispatch } from "@/lib/hooks/redux";
import {
  OnUpdateAssignedJournalPaper,
  OnUpdateAssignedJournalPaperStatus,
  onCreateRejectedPaper,
  updateSubmittedJournalPaper,
} from "@/redux/actions/journalActions";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  Fade,
  FormControl,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

type Props = {
  params: any;
  selectedValues: any;
  setFlag: any;
  flag: any;
  status: any;
  setStatus: any;
  paper: any;
  editableValue: any;
  associateNames: any;
  titles: any;
};

export const SaveButton = ({
  params,
  selectedValues,
  setFlag,
  flag,
  status,
  paper,
  editableValue,
  associateNames,
  setStatus,
  titles,
}: Props) => {
  const dispatch = useAppDispatch();
  const session = useSession();

  const reviewers_names = useSelector(
    (state: any) => state?.reviewerSlice?.value?.reviewerData
  );
  const [isLoadingSave, setIsLoadingSave] = useState<{
    [key: number]: boolean;
  }>({});
  const [rejectReason, setRejectReason] = useState("");
  const [rejectedStatus, setRejectedStatus] = useState(false);
  const [rejectId, setRejectId] = useState(Number);

  const handleRejectButton = () => {
    const filterRejectedId = paper?.filter((value: any) => {
      return value?.paperID === rejectId;
    });
    fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: filterRejectedId[0].authorEmail,
        subject: `[IST Journal] Manuscript Evaluation: Rejected`,
        body: `Dear ${filterRejectedId[0].authorNames},\n\nWe regret to inform you that your manuscript titled "${filterRejectedId[0].title}" (ID: ${filterRejectedId[0].paperID}) has been rejected after initial review.\n\nComments / Reason:\n${rejectReason}\n\nThank you for submitting your work to our journal.\n\nBest regards,\nEditorial Office`,
        templateParams: { paperID: filterRejectedId[0].paperID }
      })
    }).catch((error) => {
      console.error("An error occurred:", error);
    });

    const journalData = {
      status: "REJECTED",
    };
    const rejectedData = {
      rejectedPerson: session?.data?.user?.name,
      rejectedReasons: rejectReason,
      type: filterRejectedId[0].type,
      title: filterRejectedId[0].title,
      paperID: filterRejectedId[0].paperID,
      paperUrl: filterRejectedId[0].paperUrl,
      abstract: filterRejectedId[0].abstract,
      country: filterRejectedId[0].country,
      editorName: filterRejectedId[0].editorName,
      primaryDomain: filterRejectedId[0].primaryDomain,
      secondaryDomain: filterRejectedId[0].secondaryDomain,
      authorNames: filterRejectedId[0].authorNames,
      authorEmail: filterRejectedId[0].authorEmail,
      keywords: filterRejectedId[0].keywords,
      isSubmitted: filterRejectedId[0].isSubmitted,
      isAssigndToEditor: filterRejectedId[0].isAssigndToEditor,
      isReviewerAssigned: filterRejectedId[0].isReviewerAssigned,
      isAssociatedEditorAssigned:
        filterRejectedId[0].isAssociatedEditorAssigned,
      status: "REJECTED",
    };


    dispatch(OnUpdateAssignedJournalPaperStatus(rejectId, journalData));
    dispatch(updateSubmittedJournalPaper(rejectId, journalData));
    dispatch(onCreateRejectedPaper(rejectedData));

    setRejectedStatus(false);
    setFlag(true);
  };

  const handleRejectedOpen = () => setRejectedStatus(true);
  const handleRejectedClose = () => setRejectedStatus(false);


  const AssingToReviewer = async (paperId: number) => {

    const filterSelectedReviewer1 = reviewers_names?.find(
        (reviewer: any) => {
          return selectedValues[paperId]?.includes(reviewer?.name);
        }
      );
    const templateParams = {
      reviewer_email: filterSelectedReviewer1?.email,
      reviewer_name: filterSelectedReviewer1?.name,
    };
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: filterSelectedReviewer1?.email,
          subject: `[IST Journal] Peer Review Assignment`,
          body: `Dear Dr. ${filterSelectedReviewer1?.name},\n\nYou have been assigned to review a paper for the International Scientific and Technological Journal.\n\nPlease log in to your Reviewer Portal to access the review details.\n\nBest regards,\nEditorial Office`,
          templateParams: { reviewerName: filterSelectedReviewer1?.name }
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


    if (titles === "Editor_Queue") {
      if (selectedValues[paperId]?.length === 0) {
        Toast.fire({
          icon: "error",
          title: "Please select an reviewer before saving.",
        });
        return;
      }
      const filterSelectedReviewer = reviewers_names?.filter(
        (reviewer: any) => {
          return selectedValues[paperId]?.includes(reviewer?.name);
        }
      );
      if (selectedValues[paperId]) {
        const journalData = {
          reviewers: filterSelectedReviewer,
          isReviewerAssigned: true,
          status: "REVIEWER_ASSIGNED",
        };

        const status = {
          status: "REVIEWER_ASSIGNED",
          isReviewerAssigned: true,
        };

        setIsLoadingSave((prevState) => ({ ...prevState, [paperId]: false }));

        dispatch(OnUpdateAssignedJournalPaper(params.id, journalData));
        dispatch(updateSubmittedJournalPaper(params.id, status));
        setFlag(true);
        Toast.fire({
          icon: "success",
          title: "Reviewer Assign Successfully!.",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Please select an reviewer before saving.",
        });
      }
    }

    if (titles === "Editor_Assign_Paper") {
      setRejectId(paperId);

      if (Object.values(status)[0] === "") {
        Toast.fire({
          icon: "error",
          title: "Please Update the Status before saving.",
        });
        return;
      }
      if (status[paperId] === "REJECTED") {
        setRejectedStatus(true);
        handleRejectedOpen();
        return;
      }
      if (status[paperId]) {
        const journalData = {
          status: status[paperId],
        };

        if (status[paperId] !== "ACCEPTED" && status[paperId] !== "REJECTED") {
          dispatch(OnUpdateAssignedJournalPaperStatus(paperId, journalData));
          dispatch(updateSubmittedJournalPaper(paperId, journalData));
        }
        if (status[paperId] === "ACCEPTED") {
          if (Object.keys(associateNames)?.length === 0) {
            Toast.fire({
              icon: "error",
              title: "Please Select Associate Name before saving.",
            });
            return;
          }
          if (Object.keys(editableValue)?.length === 0) {
            Toast.fire({
              icon: "error",
              title: "Please Select editable Value before saving.",
            });
            return;
          }

          setIsLoadingSave((prevState) => ({ ...prevState, [paperId]: true }));

          const updateAssignValue = {
            isAssociatedEditorAssigned: true,
            associateEditor: associateNames[paperId],
            isEditable: editableValue[paperId] === "Yes" ? true : false,
            status: status[paperId],
          };
          const updateStatus = {
            status: status[paperId],
            isAssociatedEditorAssigned: true,
          };
          setFlag(true);
          setStatus([]);
          dispatch(
            OnUpdateAssignedJournalPaperStatus(paperId, updateAssignValue)
          );
          dispatch(updateSubmittedJournalPaper(paperId, updateStatus));

          Toast.fire({
            icon: "success",
            title: "Paper Successfully",
          });
        }
        Toast.fire({
          icon: "success",
          title: "Status Update Successfully",
        });
      } else {
        alert("Please Update the status for this paper before saving.");
      }
      setFlag(true);
      // setLoading(true);
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={rejectedStatus}
        onClose={handleRejectedClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={rejectedStatus}>
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "500px",
              bgcolor: "background.paper",
              boxShadow: 200,
              borderRadius: "8px",
              p: 4,
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleRejectedClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              sx={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: 500,
                color: "#004b23",
                fontFamily: "-moz-initial",
              }}
            >
              Reject paper for reason
            </Typography>
            <FormControl fullWidth>
              <Typography
                sx={{
                  mt: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <textarea
                  className="border-[#004b23] rounded-md hover:border-[#22481d] hover:shadow-2xl  border-opacity-80 border-2 w-full m-2 placeholder:opacity-50 placeholder:text-[#004b23] text-lg font-serif placeholder:text-lg placeholder:font-sans font-medium "
                  name=""
                  id=""
                  placeholder=" Reason...."
                  rows={4}
                  onChange={(e: any) => setRejectReason(e.target.value)}
                ></textarea>
                <button
                  onClick={() => handleRejectButton()}
                  className="bg-[#004b23]  hover:bg-gray hover:text-[#004b23] text-[#fff] transition-all duration-200 ease-linear  text-center rounded-md border-2 w-20 h-8 border-[#004b23]"
                >
                  Send
                </button>
              </Typography>
            </FormControl>
          </Box>
        </Fade>
      </Modal>
      <div className=" flex justify-center">
        <button
          className="text-[green] font-[700]  "
          onClick={() => AssingToReviewer(params.id)}
          disabled={flag}
        >
          {isLoadingSave[params.id] ? (
            <CircularProgress sx={{ color: "#004b23" }} size={20} />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </>
  );
};
