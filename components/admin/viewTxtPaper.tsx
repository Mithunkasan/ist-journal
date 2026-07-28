"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
// import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ViewTxtPaper({ modalOpen, setModalOpen, data }: any) {
  const [open, setOpen] = React.useState(modalOpen);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // setOpen(false);
    setModalOpen(false);
  };

  const txtUrl = data?.[0]?.txtUrl;
  const absoluteUrl = typeof window !== "undefined" && txtUrl && txtUrl.startsWith("/")
    ? `${window.location.origin}${txtUrl}`
    : txtUrl;

  const [resolvedDocs, setResolvedDocs] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!absoluteUrl) {
      setResolvedDocs([]);
      return;
    }

    const hasExtension = /\.[a-zA-Z0-9]+$/.test(absoluteUrl.split('?')[0].split('/').pop() || "");
    if (hasExtension) {
      setResolvedDocs([{ uri: absoluteUrl }]);
      return;
    }

    fetch(`${absoluteUrl}?info=true`)
      .then((res) => res.json())
      .then((meta) => {
        let fileType = "";
        const mime = meta.mimeType || "";
        const filename = meta.filename || "";

        if (mime.includes("pdf") || filename.endsWith(".pdf")) fileType = "pdf";
        else if (mime.includes("wordprocessingml") || mime.includes("msword") || filename.endsWith(".docx") || filename.endsWith(".doc")) fileType = "docx";
        else if (mime.includes("text/plain") || filename.endsWith(".txt")) fileType = "txt";
        else if (mime.includes("image/png") || filename.endsWith(".png")) fileType = "png";
        else if (mime.includes("image/jpeg") || filename.endsWith(".jpg") || filename.endsWith(".jpeg")) fileType = "jpg";

        setResolvedDocs([{ uri: absoluteUrl, fileType, fileName: filename }]);
      })
      .catch((err) => {
        console.error("Error fetching file metadata:", err);
        setResolvedDocs([{ uri: absoluteUrl }]);
      });
  }, [absoluteUrl]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ minWidth: "1000px" }}
      >
        <DialogTitle>{data?.[0]?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {resolvedDocs.length > 0 ? (
              <DocViewer
                documents={resolvedDocs}
                pluginRenderers={DocViewerRenderers}
                style={{ height: 1000, width: 500 }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>Loading document viewer...</div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
