"use client";
import Swal from "sweetalert2";

type Props = {
  params: any;
  values: any;
  setFlag: any;
  flag: any;   
};

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

const UploadButton = ({ params, values, setFlag, flag }: Props) => {
  const rejectPaper = async (paperId: number) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will move the paper to Round Two.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, send it!",
    });

    if (confirmed.isConfirmed) {
      try {
        const res = await fetch(`/api/update-round-two-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: params.row.id,
            newStatus: "ROUND_TWO_PAPER",
          }),
        });

        if (!res.ok) throw new Error("Failed to update status");

        Toast.fire({
          icon: "success",
          title: "Paper moved to Round Two",
        });

        setFlag(!flag);

      } catch (err) {
        console.error(err);
        Toast.fire({
          icon: "error",
          title: "Error moving paper to Round Two",
        });
      }
    }
  };

  const uploadButtons = async (paperId: number) => {
    const fileUrl = values[paperId];
    if (fileUrl === undefined || fileUrl === "") {
      Toast.fire({
        icon: "error",
        title: "Please Upload File",
      });
      return;
    }

    try {
      const res = await fetch(`/api/update-assigned-journals/update-assigned-paper-status/${params.row.paperID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            txtUrl: fileUrl,
            status: "DECISION_PENDING",
            // Keep existing fields
            paperUrl: params.row.paperUrl,
            isAssociatedEditorAssigned: params.row.isAssociatedEditorAssigned === "Yes",
            associateEditor: params.row.associateEditor,
            isEditable: params.row.isEditable === "Yes",
            isPublished: params.row.isPublished === "Yes",
          }
        }),
      });

      if (!res.ok) throw new Error("Failed to upload review");

      Toast.fire({
        icon: "success",
        title: "Review submitted successfully!",
      });

      setFlag(!flag);
    } catch (err) {
      console.error(err);
      Toast.fire({
        icon: "error",
        title: "Error submitting review",
      });
    }
  };

  return (
    <div className="flex justify-center gap-4 mt-2">
      <button
        className="px-3 py-1 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors"
        onClick={() => rejectPaper(params.row.id)}
      >
        Reject
      </button>
      <button
        className="px-3 py-1 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-colors"
        onClick={() => uploadButtons(params.row.id)}
      >
        Save
      </button>
    </div>
  );
};

export default UploadButton;