import { Box, Button, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Swal from "sweetalert2";

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

type UploadValue = {
  params: any;
  setValues: any;
};
const UploadActions = ({ params, setValues }: UploadValue) => {
  // const [files, setFile] = useState("");
  // setValues(files);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    id: any
  ) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      console.warn("no file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("files list is empty");
      return;
    }
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("something went wrong, check your console.");
        return;
      }

      const data: { fileUrl: string } = await res.json();
      if (data.fileUrl.substring(data.fileUrl.lastIndexOf(".") + 1) !== "txt") {
        Toast.fire({
          icon: "error",
          title: "File format is error.",
        });
        return;
      }
      setValues({ [id]: data.fileUrl });
    } catch (error) {
      console.error("something went wrong, check your console.");
    }
    e.target.type = "text";
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      sx={{ width: "50px" }}
    >
      <FileUploadIcon />
      <input
        type="file"
        onChange={(e) => handleFileChange(e, params.id)}
        // value={values[params.id]}
        style={{ display: "none", width: "50px" }}
        name="files"
      />
    </Button>
  );
};
export default UploadActions;
