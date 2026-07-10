import { GrValidate } from "react-icons/gr";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BugReportIcon from "@mui/icons-material/BugReport";
import { GrUpdate } from "react-icons/gr";

const homePageContent = {
  featuresArticel: [
    {
      id: 1,
      imageUrl: "https://ieeexplore.ieee.org/Xplorehelp/cfg//featured-article-images/fa_map_elites.jpg",
      title: "MAP-Elites for Genetic Programming-Based Ensemble Learning: An Interactive Approach [AI-eXplained]",
      url: "#",
    },
    {
      id: 2,
      imageUrl: "https://ieeexplore.ieee.org/Xplorehelp/cfg//featured-article-images/fa_underwater_learning_adaptive_control.jpg",
      title: "Underwater vehicles are being trained to navigate without GPS",
      url: "#",
    },
    {
      id: 3,
      imageUrl: "https://ieeexplore.ieee.org/Xplorehelp/cfg//featured-article-images/fa_standardized_wireless_charge.jpg",
      title: "I Charge, Therefore I Drive: Current State of Electric Vehicle Charging Systems",
      url: "#",
    },
  ],
  importantDates: [
    {
      id: 1,
      icon: GrValidate,
      title: "Paper Submission Till",
      titleAr: "موعد تسليم الأبحاث حتى",
      description: '<p>Issue Last Date: <b style="font-weight: bold; font-size:16px;">29<sup>th</sup> of this current Month.</b> Submit your papers anytime, No Deadline. Publish Paper within 1 to 2 days.</p>',
      descriptionAr: '<p>آخر موعد للإصدار: <b style="font-weight: bold; font-size:16px;">29 من الشهر الحالي.</b> أرسل أبحاثك في أي وقت، لا يوجد موعد نهائي. نشر البحث خلال يوم إلى يومين.</p>',
    },
    {
      id: 2,
      icon: RateReviewIcon,
      title: "Review Results Notification",
      titleAr: "إشعار نتائج المراجعة",
      description: '<p>Review Results (Acceptance/Rejection) Notification within <b style="font-weight: bold; font-size:16px;">01-02 Days</b>.</p>',
      descriptionAr: '<p>إشعار نتائج المراجعة (القبول/الرفض) خلال <b style="font-weight: bold; font-size:16px;">يوم إلى يومين</b>.</p>',
    },
    {
      id: 3,
      icon: AccessTimeIcon,
      title: "Paper Publication Time",
      titleAr: "وقت نشر البحث",
      description: '<p>Paper Publish Within <b style="font-weight: bold; font-size:16px;">01-02 Days</b> After Submitting all Required Documents.</p>',
      descriptionAr: '<p>نشر البحث خلال <b style="font-weight: bold; font-size:16px;">يوم إلى يومين</b> بعد تقديم جميع المستندات المطلوبة.</p>',
    },
    {
      id: 4,
      icon: AttachMoneyIcon,
      title: "Publication Charges",
      titleAr: "رسوم النشر",
      description: "<p>Low Publication Charge ₹1500 INR for Indian authors & $55 USD for International authors per single paper publication.</p>",
      descriptionAr: "<p>رسوم نشر منخفضة: 1500 روبية هندية للمؤلفين الهنود و 55 دولاراً أمريكياً للمؤلفين الدوليين لكل بحث منشور.</p>",
    },
    {
      id: 5,
      icon: GrUpdate,
      title: "Publication Issue Frequency",
      titleAr: "تكرار إصدار النشر",
      description: "<p>Monthly, Open Access Research Journal, Peer-Reviewed, Refereed, Multidisciplinary, Multilanguage Journals (12 issues Annually).</p>",
      descriptionAr: "<p>مجلة أبحاث شهرية، مفتوحة الوصول، محكّمة، متعددة التخصصات، متعددة اللغات (12 إصداراً سنوياً).</p>",
    },
    {
      id: 6,
      icon: BugReportIcon,
      title: "Journal Metrics & Indexing",
      titleAr: "مقاييس وفهرسة المجلة",
      description: "<p>International Peer-reviewed, Refereed Journals, and Open Access Journal | Scholarly Open access journals, Multidisciplinary, Indexing in all major databases.</p>",
      descriptionAr: "<p>مجلات دولية محكّمة ومجلات مفتوحة الوصول | مجلات علمية مفتوحة الوصول، متعددة التخصصات، مفهرسة في جميع قواعد البيانات الرئيسية.</p>",
    },
  ],
  footerContent: [
    {
      id: 1,
      title: "Publish With Us",
      titleAr: "انشر معنا",
      links: [
        { title: "Authors Guidelines", titleAr: "إرشادات المؤلفين", href: "/publish/guidelines" },
        { title: "Submit Manuscript", titleAr: "إرسال مخطوطة", href: "/journals" },
        { title: "Editorial Policies", titleAr: "السياسات التحريرية", href: "/publish/policies" },
        { title: "Open Access Options", titleAr: "خيارات الوصول المفتوح", href: "/publish/open-access" },
      ],
    },
    {
      id: 2,
      title: "Journal Info",
      titleAr: "معلومات المجلة",
      links: [
        { title: "Aims and Scope", titleAr: "الأهداف والنطاق", href: "/aims-scope" },
        { title: "Editorial Board", titleAr: "هيئة التحرير", href: "/editorial-board" },
        { title: "Journal Insights", titleAr: "رؤى المجلة", href: "/journal-insights" },
        { title: "Abstracting & Indexing", titleAr: "التكشيف والفهرسة", href: "/indexing" },
      ],
    },
    {
      id: 3,
      title: "Discover Content",
      titleAr: "اكتشف المحتوى",
      links: [
        { title: "Latest Issue", titleAr: "العدد الأخير", href: "/archive" },
        { title: "All Issues", titleAr: "جميع الأعداد", href: "/archive" },
        { title: "Articles in Press", titleAr: "مقالات تحت الطبع", href: "/archive" },
        { title: "Conferences", titleAr: "المؤتمرات", href: "/conference" },
      ],
    },
    {
      id: 4,
      title: "About IST",
      titleAr: "حول IST",
      links: [
        { title: "About Us", titleAr: "من نحن", href: "/about" },
        { title: "Contact Us", titleAr: "اتصل بنا", href: "/contact" },
        { title: "Announcements", titleAr: "الإعلانات", href: "/announcements" },
        { title: "Track Status", titleAr: "تتبع الحالة", href: "/publish/track-status" },
      ],
    },
  ],
};

export default homePageContent;
