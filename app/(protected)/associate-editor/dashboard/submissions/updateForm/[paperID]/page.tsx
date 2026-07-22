"use client";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import { CloudUploadIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

import {
  OnUpdateAssignedJournalPaperStatus,
  onCreatePublishedPaper,
  onGetAllAssignedJournalRecords,
  updateSubmittedJournalPaper,
} from "@/redux/actions/journalActions";
import { useAppDispatch } from "@/lib/hooks/redux";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { JournalPaperType } from "@/types/Journals/author";
import { useLanguage } from "@/lib/LanguageContext";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ViewPaper from "@/components/admin/viewPaper";
import { formatPaperId, parsePaperId } from "@/lib/utils/utils";

type Props = { params: { paperID: string } };

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

const UpdateForm = ({ params }: Props) => {
  const dispatch = useAppDispatch();
  const route = useRouter();

  const [files, setFile] = useState("");
  const [journalPaper, setJournalPaper] = useState<JournalPaperType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filterPaper, setFilterPaper] = useState<JournalPaperType[]>([]);
  const [doi, setDoi] = useState("");
  const { t, dir } = useLanguage();

  useEffect(() => {
    const FetchAllJournalPaper = async () => {
      try {
        // Dispatch the action and get the result
        const result = await dispatch(onGetAllAssignedJournalRecords(""));
        
        // Access the payload from the result
        const getJournalPaper = result.payload;
        
        // Make sure we have an array before filtering
        if (Array.isArray(getJournalPaper)) {
          const filterData = getJournalPaper.filter((data: JournalPaperType) => {
            return data.paperID === parsePaperId(params.paperID);
          });

          if (filterData.length > 0) {
            setFile(filterData[0].paperUrl);
            setJournalPaper(filterData);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Fetch Value Error", error);
        setLoading(false);
      }
    };
    FetchAllJournalPaper();
  }, [dispatch, params.paperID]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

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

      setFile(data.fileUrl);
    } catch (error) {
      console.error("something went wrong, check your console.");
    }

    e.target.type = "text";
    e.target.type = "file";
  };

  const handleShowPaper = (paperID: number) => {
    const paper = journalPaper?.filter((data: JournalPaperType) => {
      return data?.paperID === paperID;
    });
    setFilterPaper(paper);
    setOpen(!open);
  };

  const updatePaper = (event: any, paperID: any) => {
    event.preventDefault();
    
    if (files === "") {
      Toast.fire({
        icon: "error",
        title: "Please upload Paper",
      });
      return;
    }

    if (journalPaper.length === 0) {
      Toast.fire({
        icon: "error",
        title: "No paper data found",
      });
      return;
    }

    const data_submited = { status: "PUBLISHED", isPublished: true };

    const data = {
      paperUrl: files,
      isPublished: true,
      status: "PUBLISHED",
    };
    
    const publish_data = {
      editorName: journalPaper[0].editorName,
      associateEditor: journalPaper[0].associateEditor,
      type: journalPaper[0].type,
      keywords: journalPaper[0].keywords,
      title: journalPaper[0].title,
      paperID: journalPaper[0].paperID,
      abstract: journalPaper[0].abstract,
      paperUrl: files,
      primaryDomain: journalPaper[0].primaryDomain,
      secondaryDomain: journalPaper[0].secondaryDomain,
      country: journalPaper[0].country,
      authorNames: journalPaper[0].authorNames,
      authorEmail: journalPaper[0].authorEmail,
      updatedAt: journalPaper[0].updatedAt,
      isSubmitted: journalPaper[0].isSubmitted,
      isAssigndToEditor: journalPaper[0].isAssigndToEditor,
      isReviewerAssigned: journalPaper[0].isReviewerAssigned,
      isAssociatedEditorAssigned: journalPaper[0].isAssociatedEditorAssigned,
      volume: `Volume ${volume}`,
      issue: `Issue ${issue}`,
      isPublished: true,
      status: "PUBLISHED",
      doi: doi,
    };

    dispatch(onCreatePublishedPaper(publish_data));
    dispatch(OnUpdateAssignedJournalPaperStatus(paperID, data));
    dispatch(updateSubmittedJournalPaper(paperID, data_submited));

    Toast.fire({
      icon: "success",
      title: "Publish Successfully",
    });
    route.back();
  };

  const date = new Date();
  const issue = date.getMonth() + 1;
  const volume = 1 + (2024 - date.getFullYear());

  const handleAutoGenerateDoi = () => {
    const volNum = volume;
    const issueNum = issue;
    const generated = `10.5281/istj.Volume${volNum}.Issue${issueNum}.${params.paperID}`;
    setDoi(generated);
    Toast.fire({
      icon: "success",
      title: "DOI Generated Successfully",
    });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 items-center w-screen">
        {loading ? (
          <CircularProgress />
        ) : journalPaper?.length > 0 ? (
          journalPaper?.map((data: any, index: any) => (
            <Box
              key={index}
              component={"form"}
              sx={{ paddingTop: "10px", paddingInline: "50px" }}
            >
              <Typography
                component="h2"
                sx={{
                  color: "#004B23",
                  fontSize: "25px",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  textAlign: "center",
                  marginBottom: "30px",
                }}
              >
                {" "}
                Publish Paper
              </Typography>

              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Paper ID
                </FormLabel>
                <Box>
                  <input
                    type="text"
                    name="paperID"
                    value={formatPaperId(data.paperID)}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                    readOnly
                  />
                </Box>
              </FormControl>

              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Volume
                </FormLabel>
                <Box>
                  <input
                    type="text"
                    name="volume"
                    value={`Volume ${volume}`}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                    readOnly
                  />
                </Box>
              </FormControl>

              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Issue
                </FormLabel>
                <Box>
                  <input
                    type="text"
                    name="issue"
                    value={`Issue ${issue}`}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                    readOnly
                  />
                </Box>
              </FormControl>

              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Paper Type
                </FormLabel>
                <Box>
                  <input
                    readOnly
                    type="text"
                    name="paperType"
                    value={data.type}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                  />
                </Box>
              </FormControl>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Paper Title
                </FormLabel>
                <Box>
                  <input
                    readOnly
                    type="text"
                    name="paper title"
                    value={data.title}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                  />
                </Box>
              </FormControl>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Abstract
                </FormLabel>
                <Box>
                  <textarea
                    readOnly
                    name="abstract"
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                  >
                    {data.abstract}
                  </textarea>
                </Box>
              </FormControl>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Keywords
                </FormLabel>
                <Box>
                  <textarea
                    readOnly
                    name="keywords"
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                  >
                    {data.keywords}
                  </textarea>
                </Box>
              </FormControl>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Author Name
                </FormLabel>
                <Box>
                  <input
                    readOnly
                    type="text"
                    name="authorname"
                    value={data.authorNames}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                  />
                </Box>
              </FormControl>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Author Email
                </FormLabel>
                <Box>
                  <input
                    readOnly
                    type="text"
                    name="authoremail"
                    value={data.authorEmail}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                  />
                </Box>
              </FormControl>
              {data.isEditable ? (
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "30px",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <FormLabel
                    sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                  >
                    Upload Paper <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{ width: "250px" }}
                      >
                        Upload file
                        <input
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                          accept="doc,docx,pdf"
                          name="files"
                        />
                      </Button>
                      <span
                        style={{
                          color: "#bbb",
                          fontSize: "16px",
                          marginInline: "15px",
                        }}
                      ></span>
                    </Box>
                    <Typography
                      component={"p"}
                      sx={{
                        fontSize: "13px",
                        marginBlock: "6px",
                        color: "#000",
                      }}
                    >
                      Max file size: 5 MB. Allowed file types: pdf.
                    </Typography>
                  </Box>
                </FormControl>
              ) : (
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "30px",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <FormLabel
                    sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                  >
                    View Paper
                  </FormLabel>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      component={"p"}
                      sx={{
                        fontSize: "13px",
                        marginBlock: "6px",
                        color: "#000",
                      }}
                    >
                      <Tooltip title="View room ">
                        <IconButton
                          onClick={() => handleShowPaper(data?.paperID)}
                        >
                          <VisibilityRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </Box>
                </FormControl>
              )}

              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Primary Domain
                </FormLabel>
                <Box>
                  <input
                    readOnly
                    type="text"
                    name="primary domain"
                    value={data.primaryDomain}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                  />
                </Box>
              </FormControl>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Secondary Domain <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Box>
                  <input
                    readOnly
                    type="text"
                    name="secondary domain"
                    value={data.secondaryDomain}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                  />
                </Box>
              </FormControl>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Courntry<span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Box>
                  <input
                    readOnly
                    type="text"
                    name="country"
                    value={data.country}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                  />
                </Box>
              </FormControl>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000" }}
                >
                  Status <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Box>
                  <input
                    readOnly
                    type="text"
                    name="status"
                    value={data.status}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] w-[200px] md:w-[300px] lg:w-[500px]"
                    }
                  />
                </Box>
              </FormControl>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FormLabel
                  sx={{ fontSize: "16px", width: "310px", color: "#000", textAlign: dir === "rtl" ? "right" : "left" }}
                >
                  {t("doi.label")}
                </FormLabel>
                <Box sx={{ display: "flex", gap: "10px", alignItems: "center", width: "100%", maxWidth: { lg: "500px", md: "300px", xs: "200px" } }}>
                  <input
                    type="text"
                    name="doi"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    placeholder={t("doi.placeholder")}
                    className={
                      "outline-none border py-3 px-3 rounded-lg border-[#d2d2d2] flex-grow"
                    }
                    style={{ minWidth: "0" }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAutoGenerateDoi}
                    sx={{
                      color: "#fff",
                      backgroundColor: "#004B23",
                      height: "48px",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      ":hover": {
                        backgroundColor: "#38B000",
                        color: "#fff",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {t("doi.autogenerate")}
                  </Button>
                </Box>
              </FormControl>
              <Button
                type="submit"
                sx={{
                  display: "block",
                  color: "#fff",
                  backgroundColor: "green",
                  margin: "10px auto",
                  padding: "10px 20px",
                  alignSelf: "center",
                  transition: "all 0.4s ease",
                  ":hover": {
                    border: "2px solid #006400",
                    color: "#004b23",
                  },
                }}
                onClick={(event) => updatePaper(event, data.paperID)}
              >
                Publish
              </Button>
            </Box>
          ))
        ) : (
          <Typography>No paper data found</Typography>
        )}
      </div>
      {open && (
        <ViewPaper modalOpen={open} setModalOpen={setOpen} data={filterPaper} />
      )}
    </>
  );
};
export default UpdateForm;
