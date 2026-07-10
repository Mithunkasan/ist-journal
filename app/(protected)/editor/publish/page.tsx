"use client";
import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, CircularProgress, Box, Button } from "@mui/material";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { onGetAllAssignedJournalRecords, onCreatePublishedPaper, OnUpdateAssignedJournalPaperIsPublished } from "@/redux/actions/journalActions";
import Swal from "sweetalert2";
import { useLanguage } from "@/lib/LanguageContext";
import dynamic from "next/dynamic";

const JournalsTable = dynamic(() => import("@/components/ui/tables/JournalsTable"), {
  ssr: false,
});

const EditorPublish = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [acceptedPapers, setAcceptedPapers] = useState<any[]>([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetchAcceptedPapers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/get-assigned-journal", { method: "POST" });
        if (response.ok) {
          const allPapers = await response.json();
          // Filter only accepted papers that are not yet published
          const filterAccepted = allPapers.filter((p: any) => p.status === "ACCEPTED" && !p.isPublished);
          setAcceptedPapers(filterAccepted);
        }
      } catch (error) {
        console.error("Error fetching accepted papers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAcceptedPapers();
  }, [flag]);

  const handlePublish = async (paper: any) => {
    const date = new Date();
    const issue = date.getMonth() + 1;
    const volume = 1 + (2024 - date.getFullYear());
    const autoDoi = `10.5281/istj.Volume${volume}.Issue${issue}.${paper.paperID || paper.id}`;
    
    const isAr = lang === "ar";
    const swalTitle = isAr ? "نشر المقال وتعيين معرف DOI" : "Publish Article & Assign DOI";
    const confirmBtnText = isAr ? "نشر الآن" : "Publish Now";
    const cancelBtnText = isAr ? "إلغاء" : "Cancel";

    const { value: doiResult } = await Swal.fire({
      title: swalTitle,
      html: `
        <div style="text-align: ${isAr ? 'right' : 'left'}; font-family: inherit; direction: ${isAr ? 'rtl' : 'ltr'};">
          <p style="margin-bottom: 8px; font-weight: 600; color: #333;">
            ${isAr ? 'تعيين معرّف الكائن الرقمي (DOI):' : 'Assign Digital Object Identifier (DOI):'}
          </p>
          <input id="swal-doi-input" class="swal2-input" placeholder="e.g. 10.5281/istj.Volume5.Issue4.123" value="${autoDoi}" style="width: 85%; margin: 10px 0; font-family: inherit;">
          <div style="margin-top: 10px;">
            <button id="swal-autogen-btn" class="swal2-confirm swal2-styled" style="background-color: #004B23; margin: 0; padding: 8px 16px; font-size: 14px; font-family: inherit;">
              ${isAr ? 'إعادة التعيين إلى معرّف DOI المولد تلقائياً' : 'Reset to Auto-generated DOI'}
            </button>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 12px;">
            ${isAr ? 'التوليد التلقائي يتبع معايير OJS باستخدام المجلد الحالي، العدد، ومعرف الورقة.' : 'Auto-generated format follows OJS standards using current volume, issue, and paper ID.'}
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: confirmBtnText,
      confirmButtonColor: "#004B23",
      cancelButtonText: cancelBtnText,
      didOpen: () => {
        const input = document.getElementById("swal-doi-input") as HTMLInputElement;
        const autogenBtn = document.getElementById("swal-autogen-btn");
        if (autogenBtn && input) {
          autogenBtn.onclick = (e) => {
            e.preventDefault();
            input.value = autoDoi;
          };
        }
      },
      preConfirm: () => {
        const input = document.getElementById("swal-doi-input") as HTMLInputElement;
        return input ? input.value : "";
      }
    });

    if (doiResult === undefined) {
      return;
    }

    try {
      // Create published record
      await dispatch(onCreatePublishedPaper({ ...paper, isPublished: true, status: "PUBLISHED", doi: doiResult || null }));
      // Update assigned record
      await dispatch(OnUpdateAssignedJournalPaperIsPublished(paper.id, { isPublished: true, status: "PUBLISHED" }));
      
      Swal.fire({
        icon: "success",
        title: isAr ? "تم النشر!" : "Published!",
        text: isAr ? "تم نشر المقال بنجاح بالمعرف المحدد." : "The article was successfully published with the specified DOI.",
        confirmButtonColor: "#004B23"
      });

      setFlag(prev => !prev);
    } catch (error) {
      console.error("Failed to publish paper", error);
      Swal.fire({
        icon: "error",
        title: isAr ? "خطأ" : "Error",
        text: isAr ? "فشل نشر المقال. يرجى المحاولة مرة أخرى." : "Failed to publish the article. Please try again.",
        confirmButtonColor: "#004B23"
      });
    }
  };

  return (
    <RoleGate allowedRole={UserRole.EDITOR}>
      <Container sx={{ marginBlock: "20px" }}>
        <button
          className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
          onClick={() => router.back()}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>

        <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23', marginBlock: "30px", textAlign: "center" }}>
          Publish Approved Papers
        </Typography>

        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#004b23' }} />
            </Box>
          ) : acceptedPapers.length === 0 ? (
            <Typography sx={{ textAlign: "center", py: 5, color: "#666" }}>
              No accepted papers awaiting publication.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {acceptedPapers.map((paper) => (
                <Paper key={paper.id} sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "6px solid #4caf50" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>{paper.title}</Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                      <strong>Authors:</strong> {paper.authorNames} | <strong>Domain:</strong> {paper.primaryDomain}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Editor:</strong> {paper.editorName || "N/A"} | <strong>Assoc. Editor:</strong> {paper.associateEditor || "N/A"}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="success" 
                    size="large"
                    onClick={() => handlePublish(paper)}
                  >
                    Publish
                  </Button>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </RoleGate>
  );
};

export default EditorPublish;
