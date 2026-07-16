"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Divider from "@mui/material/Divider";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import country from "@/lib/country";
import domain from "@/lib/domain";
import { useAppDispatch } from "@/lib/hooks/redux";
import howToHearThis from "@/lib/howtoHearThis";
import { keywordsFilter } from "@/lib/keywordsFilter";
import { useLanguage } from "@/lib/LanguageContext";
import { submitJournalPaper, updateSubmittedJournalPaper } from "@/redux/actions/journalActions";
import { useRouter } from "next/navigation";
import axios from "axios";

type AuthorSubmitFormProps = {
  onSubmitted?: (paper: any) => void;
  redirectAfterSubmit?: boolean;
  redirectPath?: string;
  editPaperId?: string;
};

type AuthorDetail = {
  name: string;
  email: string;
};

const FORM_COPY = {
  en: {
    title: "Paper Submission System",
    submissionType: "Submission Type",
    researchPaper: "Research Paper",
    reviewPaper: "Review/Survey Paper",
    paperTitle: "Paper Title",
    paperTitlePlaceholder: "Enter Paper Title",
    abstract: "Abstract",
    abstractPlaceholder: "Enter Your Abstract Here...",
    uploadPaper: "Upload Paper",
    uploadFile: "Upload file",
    uploadHint: "Max file size: 5 MB. Allowed file types: doc, docx, pdf.",
    selectedFile: "Selected file",
    noFileSelected: "No file selected",
    keywords: "Keywords",
    keywordsPlaceholder: "Select up to 5 keywords",
    keywordsMax: "Maximum number of keywords is 5",
    primaryDomain: "Primary Domain",
    secondaryDomain: "Secondary Domain",
    country: "Country",
    pleaseSelect: "Please Select",
    selectCountry: "Please Select a Country",
    authorDetails: "Author Details",
    authorDetailsHint:
      "Please add all author names and email IDs. Authorship changes are not permitted after submission.",
    authorNames: "Author Name(s)",
    authorNamesPlaceholder: "Author Name 1, Author Name 2, Author Name 3...",
    authorEmail: "Author Email ID",
    authorEmailPlaceholder: "Author Email",
    addAuthor: "Add Author",
    addEmail: "Add Email",
    removeAuthor: "Remove",
    correspondingAuthor: "Corresponding author",
    orcid: "ORCID iD",
    orcidPlaceholder: "e.g. 0000-0002-1825-0097",
    orcidRequired: "ORCID identifier is required",
    orcidInvalid: "Invalid ORCID format (e.g. 0000-0002-1825-0097)",
    howToHear: "How did you hear about this journal",
    agreement: "Agreement to Publication Ethics",
    agreementText:
      "I confirm, acknowledge, and agree that the submission is original and has not been submitted or published elsewhere, and that any use of the work or words of others has been properly cited or referenced.",
    submit: "Submit",
    requiredField: "This field is required",
    uploadRequired: "Please upload a journal paper",
    uploadError: "An error occurred while uploading the paper",
    fillAllFields: "Please fill in all fields",
    submitSuccess: "You have successfully submitted the paper",
    emailError: "An error occurred while sending email",
    submitError: "An error occurred during submission",
    submitting: "Submitting...",
    noKeywordOptions: "No keywords found",
  },
  ar: {
    title: "نظام تقديم الأبحاث",
    submissionType: "نوع التقديم",
    researchPaper: "ورقة بحثية",
    reviewPaper: "ورقة مراجعة/مسحية",
    paperTitle: "عنوان البحث",
    paperTitlePlaceholder: "أدخل عنوان البحث",
    abstract: "الملخص",
    abstractPlaceholder: "أدخل الملخص هنا...",
    uploadPaper: "رفع البحث",
    uploadFile: "رفع ملف",
    uploadHint: "الحد الأقصى لحجم الملف: 5 ميجابايت. أنواع الملفات المسموح بها: DOC و DOCX و PDF.",
    selectedFile: "الملف المحدد",
    noFileSelected: "لم يتم اختيار ملف",
    keywords: "الكلمات المفتاحية",
    keywordsPlaceholder: "اختر حتى 5 كلمات مفتاحية",
    keywordsMax: "الحد الأقصى للكلمات المفتاحية هو 5",
    primaryDomain: "المجال الرئيسي",
    secondaryDomain: "المجال الثانوي",
    country: "الدولة",
    pleaseSelect: "يرجى الاختيار",
    selectCountry: "يرجى اختيار الدولة",
    authorDetails: "بيانات المؤلف",
    authorDetailsHint:
      "يرجى إضافة جميع أسماء المؤلفين وعناوين البريد الإلكتروني مفصولة بفواصل. لا يُسمح بتغيير بيانات التأليف بعد التقديم.",
    authorNames: "اسم/أسماء المؤلفين",
    authorNamesPlaceholder: "اسم المؤلف 1، اسم المؤلف 2، اسم المؤلف 3...",
    authorEmail: "البريد الإلكتروني للمؤلف",
    authorEmailPlaceholder: "البريد الإلكتروني للمؤلف",
    orcid: "معرف ORCID",
    orcidPlaceholder: "مثال: 0000-0002-1825-0097",
    orcidRequired: "معرف ORCID مطلوب",
    orcidInvalid: "صيغة معرف ORCID غير صالحة (مثال: 0000-0002-1825-0097)",
    howToHear: "كيف تعرفت على هذه المجلة؟",
    agreement: "الموافقة على أخلاقيات النشر",
    agreementText:
      "أؤكد وأقر وأوافق على أن هذا البحث أصلي ولم يُقدَّم أو يُنشر في أي مكان آخر، وأن أي استخدام لأعمال أو كلمات الآخرين قد تم توثيقه أو الإشارة إليه على النحو المناسب.",
    submit: "إرسال",
    requiredField: "هذا الحقل مطلوب",
    uploadRequired: "يرجى رفع ملف البحث",
    uploadError: "حدث خطأ أثناء رفع ملف البحث",
    fillAllFields: "يرجى تعبئة جميع الحقول",
    submitSuccess: "تم إرسال البحث بنجاح",
    emailError: "حدث خطأ أثناء إرسال البريد الإلكتروني",
    submitError: "حدث خطأ أثناء إرسال البحث",
    submitting: "جارٍ الإرسال...",
    noKeywordOptions: "لا توجد كلمات مفتاحية مطابقة",
  },
} as const;

const HEAR_ABOUT_LABELS = {
  "Email Invitation": {
    en: "Email Invitation",
    ar: "دعوة عبر البريد الإلكتروني",
  },
  "Web Search": {
    en: "Web Search",
    ar: "البحث عبر الإنترنت",
  },
  "Social Media": {
    en: "Social Media",
    ar: "وسائل التواصل الاجتماعي",
  },
  colleague: {
    en: "colleague",
    ar: "زميل",
  },
  University: {
    en: "University",
    ar: "الجامعة",
  },
  Conference: {
    en: "Conference",
    ar: "مؤتمر",
  },
} as const;

const regionNameEnglish = new Intl.DisplayNames(["en"], { type: "region" });
const regionNameArabic = new Intl.DisplayNames(["ar"], { type: "region" });

const COUNTRY_CODE_ALIASES: Record<string, string> = {
  "British Virgin Islands": "VG",
  Congo: "CG",
  "Cote d'Ivoire": "CI",
  "CuraÃ§ao": "CW",
  "Curaçao": "CW",
  "Czech Republic": "CZ",
  "Democratic Republic of the Congo": "CD",
  eSwatini: "SZ",
  Macedonia: "MK",
  "North Korea": "KP",
  "Northern Mariana": "MP",
  Palestine: "PS",
  "Republic of the Congo": "CG",
  "Sao Tome and Principe": "ST",
  "South Korea": "KR",
  "The Bahamas": "BS",
  "The Gambia": "GM",
  Turkey: "TR",
  "US Virgin Islands": "VI",
  Vietnam: "VN",
};

const COUNTRY_NAME_TO_CODE = (() => {
  const map: Record<string, string> = { ...COUNTRY_CODE_ALIASES };
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (const firstLetter of alphabet) {
    for (const secondLetter of alphabet) {
      const countryCode = `${firstLetter}${secondLetter}`;
      const englishName = regionNameEnglish.of(countryCode);

      if (englishName && englishName !== countryCode) {
        map[englishName] = countryCode;
      }
    }
  }

  return map;
})();

function getLocalizedCountryLabel(
  countryName: string,
  lang: "en" | "ar"
): string {
  if (lang === "en") {
    return countryName;
  }

  const countryCode = COUNTRY_NAME_TO_CODE[countryName];
  return countryCode ? regionNameArabic.of(countryCode) || countryName : countryName;
}

function getLocalizedHearAboutLabel(
  value: string,
  lang: "en" | "ar"
): string {
  const label = HEAR_ABOUT_LABELS[value as keyof typeof HEAR_ABOUT_LABELS];
  return label ? label[lang] : value;
}

const AuthorSubmitForm = ({
  onSubmitted,
  redirectAfterSubmit = true,
  redirectPath = "/author",
  editPaperId,
}: AuthorSubmitFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { lang, dir } = useLanguage();
  const copy = FORM_COPY[lang];
  const [selectedKeywords, setSelectedValue] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [requireOrcid, setRequireOrcid] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [authors, setAuthors] = useState<AuthorDetail[]>([
    { name: "", email: "" },
  ]);
  const [correspondingAuthorIndex, setCorrespondingAuthorIndex] = useState(0);
  const [loadingPaper, setLoadingPaper] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setRequireOrcid(localStorage.getItem("ist-require-orcid") === "true");
    }
  }, []);

  React.useEffect(() => {
    if (!editPaperId) return;
    const loadPaperData = async () => {
      try {
        setLoadingPaper(true);
        const response = await axios.get("/api/author/papers");
        const paper = response.data.find((p: any) => String(p.paperID) === editPaperId);
        if (paper) {
          setFormData({
            submissionType: paper.type || "Research Paper",
            paperTitle: paper.title || "",
            abstract: paper.abstract || "",
            primaryDomain: paper.primaryDomain || "",
            secondaryDomain: paper.secondaryDomain || "",
            country: paper.country || "",
            authorName: "",
            authorEmailId: "",
            orcid: paper.orcid || "",
            howToFindThis: paper.howToKnow || "",
            checked: true,
            category: paper.category || "AI / Computer Science",
          });

          // Parse authors
          const names = paper.authorNames ? paper.authorNames.split(", ") : [];
          const emails = paper.authorEmail ? paper.authorEmail.split(", ") : [];
          const initialAuthors = names.map((name: string, i: number) => ({
            name: name,
            email: emails[i] || "",
          }));
          if (initialAuthors.length === 0) {
            initialAuthors.push({ name: "", email: "" });
          }
          setAuthors(initialAuthors);

          // Parse keywords
          if (paper.keywords) {
            setSelectedValue(paper.keywords.split(",").map((k: string) => k.trim()));
          }

          // File URLs
          setUploadedFileUrl(paper.paperUrl || "");
          if (paper.paperUrl) {
            setSelectedFileName(paper.paperUrl.split("/").pop() || "Uploaded Manuscript");
          }
          setUploadedSupportingFileUrl(paper.supportingFilesUrl || "");
          if (paper.supportingFilesUrl) {
            setSupportingFileName(paper.supportingFilesUrl.split("/").pop() || "Uploaded Supporting Files");
          }
          setUploadedCoverLetterUrl(paper.coverLetterUrl || "");
          if (paper.coverLetterUrl) {
            setCoverLetterFileName(paper.coverLetterUrl.split("/").pop() || "Uploaded Cover Letter");
          }
        }
      } catch (error) {
        console.error("Error loading paper data for edit:", error);
      } finally {
        setLoadingPaper(false);
      }
    };
    loadPaperData();
  }, [editPaperId]);

  const paperId = useMemo(() => {
    const numericPart = parseInt(uuidv4().replace(/-/g, "").slice(0, 8), 16);
    return String(100000000 + (numericPart % 900000000));
  }, []);

  const [formData, setFormData] = useState({
    submissionType: "Research Paper",
    paperTitle: "",
    abstract: "",
    primaryDomain: "",
    secondaryDomain: "",
    country: "",
    authorName: "",
    authorEmailId: "",
    orcid: "",
    howToFindThis: "",
    checked: false,
    category: "AI / Computer Science",
  });

  const [error, setError] = useState({
    paperTitle: false,
    abstract: false,
    primaryDomain: false,
    secondaryDomain: false,
    country: false,
    authorName: false,
    authorEmailId: false,
    orcid: false,
    howToFindThis: false,
    checked: false,
    keywords: false,
    category: false,
  });

  const [supportingFile, setSupportingFile] = useState<File | null>(null);
  const [supportingFileName, setSupportingFileName] = useState("");
  const [uploadedSupportingFileUrl, setUploadedSupportingFileUrl] = useState("");

  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [coverLetterFileName, setCoverLetterFileName] = useState("");
  const [uploadedCoverLetterUrl, setUploadedCoverLetterUrl] = useState("");

  const renderRequiredError = (show: boolean) =>
    show ? (
      <p
        style={{
          marginTop: "5px",
          fontSize: "13px",
          color: "red",
          textAlign: lang === "ar" ? "right" : "left",
        }}
      >
        {copy.requiredField}
      </p>
    ) : null;

  const singleLineFieldClassName = (hasError: boolean) =>
    `${
      hasError ? "border-[red]" : "border-[#d2d2d2]"
    } outline-none border py-3 px-3 w-[300px] rounded-lg sm:w-[200px] md:w-[300px] lg:w-[500px] ${
      lang === "ar" ? "text-right" : "text-left"
    }`;

  const paperTitleClassName = (hasError: boolean) =>
    `${
      hasError ? "border-[red]" : "border-[#d2d2d2]"
    } outline-none border py-3 px-3 rounded-lg sm:w-[200px] md:w-[300px] lg:w-[500px] ${
      lang === "ar" ? "text-right" : "text-left"
    }`;

  const textareaClassName = (hasError: boolean) =>
    `${
      hasError ? "border-[red]" : "border-[#d2d2d2]"
    } outline-none border py-3 px-3 rounded-lg w-[200px] md:w-[300px] lg:w-[500px] ${
      lang === "ar" ? "text-right" : "text-left"
    }`;

  const submitPaper = async (paperUrl: string, supportingFilesUrl: string = "", coverLetterUrl: string = "") => {
    const orderedAuthors = [...authors];
    const correspondingAuthor = orderedAuthors[correspondingAuthorIndex];
    if (correspondingAuthor) {
      orderedAuthors.splice(correspondingAuthorIndex, 1);
      orderedAuthors.unshift(correspondingAuthor);
    }

    const authorNames = orderedAuthors
      .map((author) => author.name.trim())
      .filter(Boolean)
      .join(", ");
    const authorEmails = orderedAuthors
      .map((author) => author.email.trim())
      .filter(Boolean)
      .join(", ");

    const journalData: any = {
      type: formData.submissionType,
      title: formData.paperTitle,
      abstract: formData.abstract,
      paperUrl,
      primaryDomain: formData.primaryDomain,
      secondaryDomain: formData.secondaryDomain,
      country: formData.country,
      authorNames,
      authorEmail: authorEmails,
      orcid: formData.orcid,
      howToKnow: formData.howToFindThis,
      keywords: selectedKeywords.toString(),
      category: formData.category,
      supportingFilesUrl,
      coverLetterUrl,
    };

    if (editPaperId) {
      journalData.paperID = parseInt(editPaperId);
      const response = await dispatch(updateSubmittedJournalPaper(parseInt(editPaperId), journalData));
      return response;
    } else {
      journalData.paperID = parseInt(paperId);
      const response = await dispatch(submitJournalPaper(journalData));

      if (!response || typeof response !== "object" || !("id" in response)) {
        throw new Error("Failed to save journal entry");
      }

      return response;
    }
  };

  const uploadPaperFile = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data: { fileUrl: string } = await response.json();
    return data.fileUrl;
  };

  const handleSubmitPaper = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionMessage(null);

    const orcidRegex = /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/;
    const isOrcidInvalid = requireOrcid && formData.orcid.trim() !== "" && !orcidRegex.test(formData.orcid.trim());
    const hasTooManyKeywords = selectedKeywords.length > 5;
    const hasMissingUpload = !selectedFile && !uploadedFileUrl;
    const hasMissingAuthorName = authors.some((author) => !author.name.trim());
    const hasMissingAuthorEmail = !authors[0]?.email.trim();
    const hasMissingRequiredField =
      !formData.paperTitle.trim() ||
      !formData.abstract.trim() ||
      !formData.primaryDomain.trim() ||
      !formData.secondaryDomain.trim() ||
      !formData.country.trim() ||
      hasMissingAuthorEmail ||
      hasMissingAuthorName ||
      !formData.howToFindThis.trim() ||
      (requireOrcid && !formData.orcid.trim()) ||
      selectedKeywords.length === 0 ||
      !formData.checked;

    setError({
      paperTitle: formData.paperTitle.trim() === "",
      abstract: formData.abstract.trim() === "",
      primaryDomain: formData.primaryDomain.trim() === "",
      secondaryDomain: formData.secondaryDomain.trim() === "",
      country: formData.country.trim() === "",
      authorName: hasMissingAuthorName,
      authorEmailId: hasMissingAuthorEmail,
      orcid: (requireOrcid && formData.orcid.trim() === "") || isOrcidInvalid,
      howToFindThis: formData.howToFindThis.trim() === "",
      checked: !formData.checked,
      keywords: selectedKeywords.length === 0 || hasTooManyKeywords,
      category: false,
    });

    if (hasTooManyKeywords) {
      setSubmissionMessage({ type: "error", text: copy.keywordsMax });
      return;
    }

    if (hasMissingUpload) {
      setSubmissionMessage({ type: "error", text: copy.uploadRequired });
      return;
    }

    if (isOrcidInvalid) {
      setSubmissionMessage({ type: "error", text: copy.orcidInvalid });
      return;
    }

    if (hasMissingRequiredField) {
      setSubmissionMessage({ type: "error", text: copy.fillAllFields });
      return;
    }

    try {
      setIsSubmitting(true);
      const [paperUrl, supportingUrl, coverLetterUrl] = await Promise.all([
        selectedFile && uploadedFileUrl === ""
          ? uploadPaperFile(selectedFile)
          : Promise.resolve(uploadedFileUrl),
        supportingFile && uploadedSupportingFileUrl === ""
          ? uploadPaperFile(supportingFile)
          : Promise.resolve(uploadedSupportingFileUrl),
        coverLetterFile && uploadedCoverLetterUrl === ""
          ? uploadPaperFile(coverLetterFile)
          : Promise.resolve(uploadedCoverLetterUrl),
      ]);

      setUploadedFileUrl(paperUrl);
      setUploadedSupportingFileUrl(supportingUrl);
      setUploadedCoverLetterUrl(coverLetterUrl);

      const submittedPaper = await submitPaper(paperUrl, supportingUrl, coverLetterUrl);
      onSubmitted?.(submittedPaper);

      const templateParams = {
        request_title: formData.paperTitle,
        abstract: formData.abstract,
        to_email: authors.map((author) => author.email.trim()).filter(Boolean).join(", "),
        to_name: authors.map((author) => author.name.trim()).filter(Boolean).join(", "),
        request_id: paperId,
        submission_date: new Date().toLocaleDateString(),
        company_name: "IST-ONLINE-Journal",
        support_email: "",
        website_url: "https://yourwebsite.com",
        logo_url: "https://yourwebsite.com/logo.png",
      };

      try {
        const toEmails = authors.map((author) => author.email.trim()).filter(Boolean).join(", ");
        const toNames = authors.map((author) => author.name.trim()).filter(Boolean).join(", ");
        
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: toEmails,
            subject: `[IST Journal] Manuscript Submitted Successfully`,
            body: `Dear ${toNames},\n\nYour manuscript titled "${formData.paperTitle}" has been successfully submitted and is awaiting editorial initial screening.\n\nPaper ID: ${paperId}\nSubmission Date: ${new Date().toLocaleDateString()}\n\nBest regards,\nEditorial Board`,
            templateParams: { paperID: paperId }
          })
        });
      } catch (emailError) {
        console.error(emailError);
        setSubmissionMessage({ type: "error", text: copy.emailError });
      }

      setSubmissionMessage({ type: "success", text: copy.submitSuccess });

      if (redirectAfterSubmit) {
        window.setTimeout(() => {
          router.replace(redirectPath);
          router.refresh();
        }, 1500);
        return;
      }

      setFormData({
        submissionType: "Research Paper",
        paperTitle: "",
        abstract: "",
        primaryDomain: "",
        secondaryDomain: "",
        country: "",
        authorName: "",
        authorEmailId: "",
        orcid: "",
        howToFindThis: "",
        checked: false,
        category: "AI / Computer Science",
      });
      setSelectedValue([]);
      setSelectedFile(null);
      setSelectedFileName("");
      setUploadedFileUrl("");
      setAuthors([{ name: "", email: "" }]);
      setCorrespondingAuthorIndex(0);
      setSupportingFile(null);
      setSupportingFileName("");
      setUploadedSupportingFileUrl("");

      setCoverLetterFile(null);
      setCoverLetterFileName("");
      setUploadedCoverLetterUrl("");
    } catch (submitError) {
      console.error(submitError);
      if (submitError instanceof Error && submitError.message === "Failed to upload file") {
        setSubmissionMessage({ type: "error", text: copy.uploadError });
      } else if (submitError instanceof Error && submitError.message.trim() !== "") {
        setSubmissionMessage({ type: "error", text: submitError.message });
      } else {
        setSubmissionMessage({ type: "error", text: copy.submitError });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>,
    property: string
  ) => {
    setFormData((prevAnswer) => ({
      ...prevAnswer,
      [property]: event.target.value,
    }));
  };

  const handleAcknowledgement = (
    _event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => {
    setFormData((prevAnswer) => ({
      ...prevAnswer,
      checked,
    }));
  };

  const addAuthor = () => {
    setAuthors((prevAuthors) => [...prevAuthors, { name: "", email: "" }]);
  };

  const removeAuthor = (index: number) => {
    if (index === 0) {
      return;
    }

    setAuthors((prevAuthors) => prevAuthors.filter((_, authorIndex) => authorIndex !== index));
    setCorrespondingAuthorIndex((prevIndex) => {
      if (prevIndex === index) {
        return 0;
      }

      return prevIndex > index ? prevIndex - 1 : prevIndex;
    });
  };

  const updateAuthor = (
    index: number,
    property: keyof AuthorDetail,
    value: string
  ) => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author, authorIndex) =>
        authorIndex === index ? { ...author, [property]: value } : author
      )
    );
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("files list is empty");
      return;
    }

    const file = fileInput.files[0];
    setSelectedFile(file);
    setSelectedFileName(file.name);
    setUploadedFileUrl("");
    event.target.value = "";
  };

  const handleKeywordChange = (selectedOptions: any) => {
    setSelectedValue(
      Array.isArray(selectedOptions)
        ? selectedOptions.map((option) => option.value)
        : []
    );
  };

  const domainOptions = domain.filter((item) => item !== "Please Select");
  const countryOptions = country.filter(
    (item) => item !== "Please Select a Country"
  );
  const howToHearOptions = howToHearThis.filter((item) => item !== "Please Select");

  return (
    <>
      <Paper
        elevation={3}
        dir={dir}
        sx={{
          marginBlock: "20px",
          paddingBlock: "20px",
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {loadingPaper ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#004b23" }} />
          </Box>
        ) : (
          <Box
            component="form"
            dir={dir}
            onSubmit={handleSubmitPaper}
            noValidate
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
              {editPaperId ? (lang === "ar" ? "تحديث تفاصيل البحث" : "Update Paper Details") : copy.title}
            </Typography>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "flex-start",
              marginBottom: "20px",
            }}
          >
            <FormLabel
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.submissionType} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <RadioGroup
              aria-labelledby="submission-type-label"
              name="submissionType"
              value={formData.submissionType}
              onChange={(event) => handleInputChange(event, "submissionType")}
            >
              <FormControlLabel
                value="Research Paper"
                control={<Radio />}
                label={copy.researchPaper}
              />
              <FormControlLabel
                value="Review/Survey Paper"
                control={<Radio />}
                label={copy.reviewPaper}
              />
            </RadioGroup>
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.paperTitle} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <input
                required
                type="text"
                name="paperTitle"
                dir={dir}
                value={formData.paperTitle}
                className={paperTitleClassName(error.paperTitle)}
                placeholder={copy.paperTitlePlaceholder}
                onChange={(event) => handleInputChange(event, "paperTitle")}
              />
              {renderRequiredError(error.paperTitle)}
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {lang === "ar" ? "فئة المخطوطة" : "Manuscript Category"} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <select
                required
                dir={dir}
                className={singleLineFieldClassName(error.category)}
                name="category"
                value={formData.category}
                onChange={(event) => handleInputChange(event, "category")}
                style={{ background: "#fff" }}
              >
                <option value="AI / Computer Science">AI / Computer Science</option>
                <option value="Medical / Health Sciences">Medical / Health Sciences</option>
                <option value="Engineering / Technology">Engineering / Technology</option>
                <option value="Life Sciences / Biology">Life Sciences / Biology</option>
                <option value="Physical Sciences / Physics">Physical Sciences / Physics</option>
                <option value="Social Sciences / Humanities">Social Sciences / Humanities</option>
              </select>
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.abstract} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <textarea
                required
                dir={dir}
                className={textareaClassName(error.abstract)}
                value={formData.abstract}
                onChange={(event) => handleInputChange(event, "abstract")}
                name="abstract"
                rows={4}
                cols={50}
                placeholder={copy.abstractPlaceholder}
              />
              {renderRequiredError(error.abstract)}
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.uploadPaper} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box>
                <Button
                  component="label"
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{ width: "250px" }}
                  disabled={isSubmitting}
                >
                  {copy.uploadFile}
                  <input
                    type="file"
                    name="paperFile"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept=".doc,.docx,.pdf"
                  />
                </Button>
              </Box>
              <Typography
                component="p"
                sx={{
                  fontSize: "13px",
                  marginTop: "6px",
                  color: "#004B23",
                  textAlign: lang === "ar" ? "right" : "left",
                  wordBreak: "break-word",
                }}
              >
                {copy.selectedFile}: {selectedFileName || copy.noFileSelected}
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: "13px",
                  marginBlock: "6px",
                  color: "#000",
                  textAlign: lang === "ar" ? "right" : "left",
                }}
              >
                {copy.uploadHint}
              </Typography>
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {lang === "ar" ? "خطاب التغطية" : "Cover Letter"}
            </FormLabel>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box>
                <Button
                  component="label"
                  variant="contained"
                  color="info"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{ width: "250px", bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  disabled={isSubmitting}
                >
                  {copy.uploadFile}
                  <input
                    type="file"
                    name="coverLetterFile"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setCoverLetterFile(e.target.files[0]);
                        setCoverLetterFileName(e.target.files[0].name);
                        setUploadedCoverLetterUrl("");
                      }
                    }}
                    style={{ display: "none" }}
                    accept=".doc,.docx,.pdf,.txt"
                  />
                </Button>
              </Box>
              <Typography
                component="p"
                sx={{
                  fontSize: "13px",
                  marginTop: "6px",
                  color: "#1976d2",
                  textAlign: lang === "ar" ? "right" : "left",
                  wordBreak: "break-word",
                }}
              >
                {copy.selectedFile}: {coverLetterFileName || copy.noFileSelected}
              </Typography>
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {lang === "ar" ? "الملفات الداعمة" : "Supporting Files"}
            </FormLabel>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box>
                <Button
                  component="label"
                  variant="contained"
                  color="secondary"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{ width: "250px", bgcolor: '#4a148c', '&:hover': { bgcolor: '#311b92' } }}
                  disabled={isSubmitting}
                >
                  {copy.uploadFile}
                  <input
                    type="file"
                    name="supportingFile"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSupportingFile(e.target.files[0]);
                        setSupportingFileName(e.target.files[0].name);
                        setUploadedSupportingFileUrl("");
                      }
                    }}
                    style={{ display: "none" }}
                    accept=".doc,.docx,.pdf,.zip,.rar,.txt,.jpg,.png"
                  />
                </Button>
              </Box>
              <Typography
                component="p"
                sx={{
                  fontSize: "13px",
                  marginTop: "6px",
                  color: "#4a148c",
                  textAlign: lang === "ar" ? "right" : "left",
                  wordBreak: "break-word",
                }}
              >
                {copy.selectedFile}: {supportingFileName || copy.noFileSelected}
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: "13px",
                  marginBlock: "6px",
                  color: "#000",
                  textAlign: lang === "ar" ? "right" : "left",
                }}
              >
                {lang === "ar" ? "الحد الأقصى لحجم الملف: 10 ميجابايت. الملحقات المسموح بها: PDF, ZIP, TXT, DOCX, Images" : "Max size: 10 MB. Allowed: PDF, ZIP, TXT, DOCX, Images"}
              </Typography>
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.keywords} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <Select
                isMulti
                isRtl={lang === "ar"}
                name="keywords"
                options={keywordsFilter}
                className="basic-multi-select sm:w-[200px] md:w-[300px] lg:w-[500px]"
                classNamePrefix="select"
                placeholder={copy.keywordsPlaceholder}
                noOptionsMessage={() => copy.noKeywordOptions}
                value={keywordsFilter.filter((option) =>
                  selectedKeywords.includes(option.value)
                )}
                onChange={handleKeywordChange}
                isOptionDisabled={(option) =>
                  !selectedKeywords.includes(option.value) &&
                  selectedKeywords.length >= 5
                }
              />
              {renderRequiredError(error.keywords && selectedKeywords.length === 0)}
              {selectedKeywords.length > 5 && (
                <p
                  style={{
                    marginTop: "5px",
                    fontSize: "13px",
                    color: "red",
                    textAlign: lang === "ar" ? "right" : "left",
                  }}
                >
                  {copy.keywordsMax}
                </p>
              )}
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.primaryDomain} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <select
                required
                dir={dir}
                className={singleLineFieldClassName(error.primaryDomain)}
                name="primaryDomain"
                value={formData.primaryDomain}
                onChange={(event) => handleInputChange(event, "primaryDomain")}
              >
                <option value="">{copy.pleaseSelect}</option>
                {domainOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {renderRequiredError(error.primaryDomain)}
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.secondaryDomain} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <select
                required
                dir={dir}
                className={singleLineFieldClassName(error.secondaryDomain)}
                name="secondaryDomain"
                value={formData.secondaryDomain}
                onChange={(event) =>
                  handleInputChange(event, "secondaryDomain")
                }
              >
                <option value="">{copy.pleaseSelect}</option>
                {domainOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {renderRequiredError(error.secondaryDomain)}
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.country} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <select
                required
                dir={dir}
                className={singleLineFieldClassName(error.country)}
                name="country"
                value={formData.country}
                onChange={(event) => handleInputChange(event, "country")}
              >
                <option value="">{copy.selectCountry}</option>
                {countryOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {getLocalizedCountryLabel(option, lang)}
                  </option>
                ))}
              </select>
              {renderRequiredError(error.country)}
            </Box>
          </FormControl>

          <Divider
            sx={{
              height: "2px",
              background: "#38B000",
              marginBottom: "30px",
              marginTop: "50px",
            }}
          />

          <Typography
            component="h2"
            sx={{
              color: "#004B23",
              fontSize: "25px",
              fontWeight: 700,
              fontFamily: "inherit",
              marginTop: "20px",
              textAlign: "center",
              marginBottom: "1px",
            }}
          >
            {copy.authorDetails}
          </Typography>

          <Typography
            component="p"
            sx={{
              fontSize: "14px",
              fontFamily: "inherit",
              color: "gray",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {copy.authorDetailsHint}
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.authorNames} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {authors.map((author, index) => (
                <Box key={`author-name-${index}`} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <button
                    type="button"
                    title="Mark as corresponding author"
                    aria-label="Mark as corresponding author"
                    onClick={() => setCorrespondingAuthorIndex(index)}
                    className="text-[#004B23] flex h-10 w-10 items-center justify-center rounded-md border border-[#d2d2d2]"
                  >
                    {correspondingAuthorIndex === index ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                  </button>
                  <input
                    type="text"
                    name={`authorName-${index}`}
                    dir={dir}
                    value={author.name}
                    className={singleLineFieldClassName(error.authorName && !author.name.trim())}
                    placeholder={lang === "ar" ? `المؤلف ${index + 1}` : `Author ${index + 1}`}
                    onChange={(event) => updateAuthor(index, "name", event.target.value)}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outlined"
                      color="error"
                      onClick={() => removeAuthor(index)}
                      sx={{ minWidth: 90, height: 42 }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button
                type="button"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addAuthor}
                sx={{ width: "fit-content", color: "#004B23", borderColor: "#004B23" }}
              >
                Add Author
              </Button>
              {renderRequiredError(error.authorName)}
            </Box>
          </FormControl>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "flex-start",
              marginBottom: "20px",
            }}
          >
            <FormLabel
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.authorEmail}
            </FormLabel>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {authors.map((author, index) => (
                <Box key={`author-email-${index}`} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Box
                    component="span"
                    title={correspondingAuthorIndex === index ? "Corresponding author" : undefined}
                    sx={{ color: "#004B23", width: 40, display: "flex", justifyContent: "center" }}
                  >
                    {correspondingAuthorIndex === index ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                  </Box>
                  <input
                    required={index === 0}
                    type="email"
                    name={`authorEmail-${index}`}
                    dir={dir}
                    value={author.email}
                    className={singleLineFieldClassName(error.authorEmailId && index === 0 && !author.email.trim())}
                    placeholder={copy.authorEmailPlaceholder}
                    onChange={(event) => updateAuthor(index, "email", event.target.value)}
                  />
                  {index === 0 && <span style={{ color: "red" }}>*</span>}
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outlined"
                      color="error"
                      onClick={() => removeAuthor(index)}
                      sx={{ minWidth: 90, height: 42 }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button
                type="button"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addAuthor}
                sx={{ width: "fit-content", color: "#004B23", borderColor: "#004B23" }}
              >
                Add Email
              </Button>
              {renderRequiredError(error.authorEmailId)}
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.orcid} {requireOrcid && <span style={{ color: "red" }}>*</span>}
            </FormLabel>
            <Box>
              <input
                type="text"
                name="orcid"
                dir="ltr"
                value={formData.orcid}
                className={singleLineFieldClassName(error.orcid)}
                placeholder={copy.orcidPlaceholder}
                onChange={(event) => handleInputChange(event, "orcid")}
              />
              {requireOrcid && error.orcid && formData.orcid.trim() === "" && renderRequiredError(true)}
              {error.orcid && formData.orcid.trim() !== "" && (
                <p style={{ marginTop: "5px", fontSize: "13px", color: "red", textAlign: lang === "ar" ? "right" : "left" }}>
                  {copy.orcidInvalid}
                </p>
              )}
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.howToHear} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <select
                required
                dir={dir}
                className={singleLineFieldClassName(error.howToFindThis)}
                name="howToFindThis"
                value={formData.howToFindThis}
                onChange={(event) => handleInputChange(event, "howToFindThis")}
              >
                <option value="">{copy.pleaseSelect}</option>
                {howToHearOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {getLocalizedHearAboutLabel(option, lang)}
                  </option>
                ))}
              </select>
              {renderRequiredError(error.howToFindThis)}
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
              sx={{
                fontSize: "16px",
                width: "310px",
                color: "#000",
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {copy.agreement} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex" }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label=""
                  checked={formData.checked}
                  onChange={handleAcknowledgement}
                />
                <Typography
                  sx={{
                    maxWidth: "400px",
                    textAlign: lang === "ar" ? "right" : "left",
                  }}
                >
                  {copy.agreementText}
                </Typography>
              </Box>
              {renderRequiredError(error.checked)}
            </Box>
          </FormControl>

          <Button
            type="submit"
            disabled={isSubmitting}
            sx={{
              display: "block",
              color: "#fff",
              backgroundColor: isSubmitting ? "#6b7280" : "green",
              margin: "10px auto",
              padding: "10px 20px",
              alignSelf: "center",
              transition: "all 0.4s ease",
              ":hover": {
                border: "2px solid #006400",
                color: "#004b23",
              },
            }}
          >
            {isSubmitting ? copy.submitting : (editPaperId ? (lang === "ar" ? "تحديث" : "Update") : copy.submit)}
          </Button>
          {submissionMessage && (
            <Typography
              role="status"
              aria-live="polite"
              sx={{
                color: submissionMessage.type === "success" ? "#166534" : "#b91c1c",
                backgroundColor: submissionMessage.type === "success" ? "#dcfce7" : "#fee2e2",
                border: `1px solid ${submissionMessage.type === "success" ? "#86efac" : "#fecaca"}`,
                borderRadius: "8px",
                fontSize: "14px",
                margin: "8px auto 0",
                maxWidth: "500px",
                padding: "10px 14px",
                textAlign: "center",
              }}
            >
              {submissionMessage.text}
            </Typography>
          )}
        </Box>
        )}
      </Paper>
    </>
  );
};

export default AuthorSubmitForm;
