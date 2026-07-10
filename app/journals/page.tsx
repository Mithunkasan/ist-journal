"use client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React from "react";
import Divider from "@mui/material/Divider";
import AuthorSubmitForm from "../../components/journals/AuthorSubmitForm";
import { Box } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import { useLanguage } from "@/lib/LanguageContext";

const Journals = () => {
  const { lang, t } = useLanguage();

  return (
    <Container className={lang === "ar" ? "rtl" : "ltr"}>
      <Typography
        component="h2"
        sx={{
          color: "#004B23",
          fontSize: "25px",
          fontWeight: 700,
          fontFamily: "inherit",
          marginBlock: "20px",
          "@media(max-width:768px)": {
            textAlign: "center",
          },
        }}
      >
        {lang === "en" ? "Submit your Paper" : "أرسل بحثك"}
      </Typography>
      <Divider
        sx={{
          height: "2px",
          background: "#38B000",
          marginBottom: "12px",
        }}
      />
      <Typography
        component={"p"}
        sx={{
          fontWeight: "bold",
          color: "#1a4022",
          mb: 2,
          "@media(max-width:768px)": {
            textAlign: "center",
          },
        }}
      >
        {lang === "en" 
          ? "IST Online Journal (International Journal of Current Science)" 
          : "مجلة IST الإلكترونية (المجلة الدولية للعلوم الحالية)"}
      </Typography>

      <AuthorSubmitForm />

      <Typography
        component="h2"
        sx={{
          color: "#004B23",
          fontSize: "25px",
          fontWeight: 700,
          fontFamily: "inherit",
          marginBlock: "30px 10px",
          "@media(max-width:768px)": {
            textAlign: "center",
          },
        }}
      >
        {lang === "en" ? "Submission By E-Mail" : "التقديم عبر البريد الإلكتروني"}
      </Typography>

      <Typography
        component={"p"}
        sx={{
          fontSize: "16px",
          "@media(max-width:768px)": {
            textAlign: "center",
          },
        }}
      >
        {lang === "en" 
          ? "Submission of Manuscripts can also be done by email to " 
          : "يمكن أيضًا تقديم المخطوطات عبر البريد الإلكتروني إلى "}
        <a href="mailto:editor@istjournal.ly" className="text-blue-600 font-medium hover:underline">
          editor@istjournal.ly
        </a>
      </Typography>

      <Typography
        component={"p"}
        sx={{
          marginBlock: "15px",
          fontWeight: "bold",
          "@media(max-width:768px)": {
            textAlign: "center",
          },
        }}
      >
        {lang === "en" ? "Please Note the following when submitting by Email:" : "يرجى ملاحظة ما يلي عند التقديم عبر البريد الإلكتروني:"}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px", mb: 8 }}>
        <Typography
          component={"p"}
          sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
        >
          <span style={{ color: "#006400", marginTop: "2px" }}>
            <EastIcon sx={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }} />
          </span>
          {lang === "en" 
            ? 'The Subject Line Should be : Paper Submission : "Paper Title"' 
            : 'يجب أن يكون سطر الموضوع: تقديم بحث : "عنوان البحث"'}
        </Typography>

        <Typography
          component={"p"}
          sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
        >
          <span style={{ color: "#006400", marginTop: "2px" }}>
            <EastIcon sx={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }} />
          </span>
          {lang === "en" 
            ? "A Cover letter should be included along with the submission which should indicate the domain of research to expedite the review process of the manuscript." 
            : "يجب تضمين خطاب تغطية مع التقديم والذي يجب أن يشير إلى مجال البحث لتسريع عملية مراجعة المخطوطة."}
        </Typography>

        <Typography
          component={"p"}
          sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
        >
          <span style={{ color: "#006400", marginTop: "2px" }}>
            <EastIcon sx={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }} />
          </span>
          {lang === "en" 
            ? "The Manuscript should be sent in .docx or .pdf format." 
            : "يجب إرسال المخطوطة بتنسيق .docx أو .pdf."}
        </Typography>
      </Box>
    </Container>
  );
};

export default Journals;
