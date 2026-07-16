"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Lang = "en" | "ar";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  dir: "ltr",
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

// Translation dictionary - kept inline for simplicity
const translations: Record<string, string> = {
  // Navbar
  "nav.home": "Home", "nav.home.ar": "الرئيسية",
  "nav.about": "About", "nav.about.ar": "حول المجلة",
  "nav.conferences": "Conferences", "nav.conferences.ar": "المؤتمرات",
  "nav.archive": "Archive", "nav.archive.ar": "الأرشيف",
  "nav.contact": "Contact", "nav.contact.ar": "اتصل بنا",
  "nav.signin": "Sign In", "nav.signin.ar": "تسجيل الدخول",
  "nav.signup": "Sign Up", "nav.signup.ar": "إنشاء حساب",
  "nav.signout": "Sign Out", "nav.signout.ar": "تسجيل الخروج",
  "nav.admin": "Admin Dashboard", "nav.admin.ar": "لوحة الإدارة",
  "nav.editor": "Editor Dashboard", "nav.editor.ar": "لوحة المحرر",
  "nav.associate": "Associate Editor Dashboard", "nav.associate.ar": "لوحة المحرر المساعد",
  "nav.reviewer": "Reviewer Dashboard", "nav.reviewer.ar": "لوحة المراجع",

  // Secondary Nav
  "snav.articles": "Articles & Issues", "snav.articles.ar": "المقالات والأعداد",
  "snav.author": "Author", "snav.author.ar": "المؤلف",
  "snav.publish": "Publish", "snav.publish.ar": "النشر",
  "snav.submit": "Submit Your Paper", "snav.submit.ar": "أرسل بحثك",
  "snav.latest": "Latest Issue", "snav.latest.ar": "العدد الأخير",
  "snav.allissues": "All Issues", "snav.allissues.ar": "جميع الأعداد",
  "snav.inpress": "Articles in Press", "snav.inpress.ar": "مقالات تحت الطبع",
  "snav.submitarticle": "Submit Your Article", "snav.submitarticle.ar": "أرسل مقالك",
  "snav.track": "Track Your Paper Status", "snav.track.ar": "تتبع حالة بحثك",
  "snav.aims": "Aims and Scope", "snav.aims.ar": "الأهداف والنطاق",
  "snav.board": "Editorial Board", "snav.board.ar": "هيئة التحرير",
  "snav.insights": "Journal Insights", "snav.insights.ar": "إحصائيات المجلة",
  "snav.indexing": "Abstracting and Indexing", "snav.indexing.ar": "التكشيف والفهرسة",
  "snav.announcements": "Announcements", "snav.announcements.ar": "الإعلانات",
  "snav.guide": "Guide for Authors", "snav.guide.ar": "دليل المؤلفين",
  "snav.policies": "Policies and Guidelines", "snav.policies.ar": "السياسات والإرشادات",
  "snav.openaccess": "Open Access Options", "snav.openaccess.ar": "خيارات الوصول المفتوح",

  // Hero
  "hero.title": "IST Online Journal", "hero.title.ar": "مجلة IST الإلكترونية",
  "hero.subtitle": "INTERNATIONAL JOURNAL OF CURRENT SCIENCE", "hero.subtitle.ar": "المجلة الدولية للعلوم الحالية",
  "hero.submit": "Submit Paper", "hero.submit.ar": "أرسل بحثك",
  "hero.issn": "ISSN: 2584-180X (Online)", "hero.issn.ar": "ISSN: 2584-180X (إلكتروني)",

  // About section
  "about.title": "IST Online Journal", "about.title.ar": "مجلة IST الإلكترونية",

  // Key Dates
  "dates.title": "Key Dates", "dates.title.ar": "تواريخ مهمة",

  // Editor
  "editor.title": "Editor-in-Chief", "editor.title.ar": "رئيس التحرير",
  "editor.viewboard": "View Full Editorial Board", "editor.viewboard.ar": "عرض هيئة التحرير الكاملة",
  "editor.name": "Prof. Dr. Ahmed Al-Mansouri", "editor.name.ar": "أ.د. أحمد المنصوري",
  "editor.affiliation": "Faculty of Information Technology, University of Tripoli, Libya",
  "editor.affiliation.ar": "كلية تقنية المعلومات، جامعة طرابلس، ليبيا",

  // Articles
  "articles.title": "Articles", "articles.title.ar": "المقالات",
  "articles.latest": "Latest Published", "articles.latest.ar": "أحدث المنشورات",
  "articles.inpress": "Article in Press", "articles.inpress.ar": "مقالات تحت الطبع",
  "articles.cited": "Top Cited", "articles.cited.ar": "الأكثر استشهاداً",
  "articles.download": "Most Downloaded", "articles.download.ar": "الأكثر تحميلاً",
  "articles.popular": "Most Popular", "articles.popular.ar": "الأكثر شعبية",

  // Call for Papers
  "cfp.title": "Browse Open Call for Papers", "cfp.title.ar": "تصفح الدعوات المفتوحة للأبحاث",

  // Contact
  "contact.title": "Contact Us", "contact.title.ar": "اتصل بنا",
  "contact.subtitle": "Feel Free To Contact Us Anytime", "contact.subtitle.ar": "لا تتردد في الاتصال بنا في أي وقت",
  "contact.desc": "Have a question or feedback? Reach out to us, and we'll be happy to assist you.",
  "contact.desc.ar": "هل لديك سؤال أو ملاحظة؟ تواصل معنا وسنكون سعداء بمساعدتك.",
  "contact.name": "Name", "contact.name.ar": "الاسم",
  "contact.email": "E-mail", "contact.email.ar": "البريد الإلكتروني",
  "contact.message": "Message", "contact.message.ar": "الرسالة",
  "contact.send": "Send Message", "contact.send.ar": "إرسال الرسالة",

  // About Page
  "aboutpage.title": "About Us", "aboutpage.title.ar": "من نحن",
  "aboutpage.desc": "The IST Online Journal (International Journal of Current Science) is a peer-reviewed, open-access academic journal dedicated to advancing knowledge in Information Science and Technology. Published monthly (12 issues per year), the journal provides a platform for researchers, academics, and practitioners worldwide to share their findings across multiple disciplines.",
  "aboutpage.desc.ar": "مجلة IST الإلكترونية (المجلة الدولية للعلوم الحالية) هي مجلة أكاديمية محكّمة ومتاحة الوصول، مكرسة لتطوير المعرفة في علوم وتقنية المعلومات. تصدر شهرياً (12 عدداً في السنة)، وتوفر منصة للباحثين والأكاديميين والممارسين في جميع أنحاء العالم لمشاركة نتائج أبحاثهم عبر تخصصات متعددة.",

  // Footer
  "footer.publish": "Publish With Us", "footer.publish.ar": "انشر معنا",
  "footer.services": "Other Services", "footer.services.ar": "خدمات أخرى",
  "footer.discover": "Discover Content", "footer.discover.ar": "اكتشف المحتوى",
  "footer.aboutist": "About IST", "footer.aboutist.ar": "حول IST",
  "footer.copyright": "© 2025 IST Online Journal. All rights reserved.",
  "footer.copyright.ar": "© 2025 مجلة IST الإلكترونية. جميع الحقوق محفوظة.",
  "footer.issn": "ISSN: 2584-180X (Online)", "footer.issn.ar": "ISSN: 2584-180X (إلكتروني)",
  "footer.owner": "Published by the Faculty of Information Technology, University of Tripoli",
  "footer.owner.ar": "تصدر عن كلية تقنية المعلومات، جامعة طرابلس",

  // Track Paper Page
  "track.title": "Track Your Paper", "track.title.ar": "تتبع بحثك",
  "track.subtitle": "Enter Your Paper ID (six digit number only)", "track.subtitle.ar": "أدخل معرف البحث الخاص بك (ستة أرقام فقط)",
  "track.paperId": "Paper Id", "track.paperId.ar": "معرف البحث",
  "track.placeholder": "Enter Paper Id", "track.placeholder.ar": "أدخل معرف البحث",
  "track.required": "This Field is Required", "track.required.ar": "هذا الحقل مطلوب",
  "track.submit": "Submit", "track.submit.ar": "إرسال",
  "track.cardId": "Paper Id:", "track.cardId.ar": "معرف البحث:",
  "track.cardTitle": "Paper Title:", "track.cardTitle.ar": "عنوان البحث:",
  "track.cardType": "Paper Type:", "track.cardType.ar": "نوع البحث:",
  "track.cardDate": "Submitted Date:", "track.cardDate.ar": "تاريخ التقديم:",
  "track.cardStatus": "Paper Status:", "track.cardStatus.ar": "حالة البحث:",

  // Shared
  "search.placeholder": "Search…", "search.placeholder.ar": "بحث…",

  // DOI translation strings
  "doi.label": "Digital Object Identifier (DOI)", "doi.label.ar": "معرّف الكائن الرقمي (DOI)",
  "doi.autogenerate": "Auto-generate", "doi.autogenerate.ar": "توليد تلقائي",
  "doi.placeholder": "Enter DOI (e.g. 10.xxxx/xxxx)", "doi.placeholder.ar": "أدخل معرف DOI (مثال: 10.xxxx/xxxx)",

  // Login Page
  "login.title": "Sign in to your account", "login.title.ar": "تسجيل الدخول إلى حسابك",
  "login.email": "Email address", "login.email.ar": "البريد الإلكتروني",
  "login.password": "Password", "login.password.ar": "كلمة المرور",
  "login.button": "Sign In", "login.button.ar": "تسجيل الدخول",
  "login.signingin": "Signing in...", "login.signingin.ar": "جاري تسجيل الدخول...",
  "login.noaccount": "Not an Account?", "login.noaccount.ar": "ليس لديك حساب؟",
  "login.registernow": "Register Now", "login.registernow.ar": "سجل الآن",
  "login.required": "This Field is Required", "login.required.ar": "هذا الحقل مطلوب",

  // Register Page
  "register.title": "Create an Account", "register.title.ar": "إنشاء حساب جديد",
  "register.name": "Full Name", "register.name.ar": "الاسم الكامل",
  "register.email": "Email Address", "register.email.ar": "البريد الإلكتروني",
  "register.password": "Password", "register.password.ar": "كلمة المرور",
  "register.university": "University / Affiliation", "register.university.ar": "الجامعة / الجهة التابع لها",
  "register.qualification": "Academic Qualification", "register.qualification.ar": "المؤهل العلمي",
  "register.orcid": "ORCID iD (optional)", "register.orcid.ar": "معرف ORCID (اختياري)",
  "register.expertise": "Area of Expertise", "register.expertise.ar": "مجال الخبرة",
  "register.role": "Register As", "register.role.ar": "التسجيل كـ",
  "register.button": "Register Now", "register.button.ar": "سجل الآن",
  "register.registering": "Registering...", "register.registering.ar": "جاري التسجيل...",
  "register.alreadyaccount": "Already have an account?", "register.alreadyaccount.ar": "لديك حساب بالفعل؟",
  "register.loginnow": "Login Now", "register.loginnow.ar": "سجل الدخول الآن",
  "register.required": "This Field is Required", "register.required.ar": "هذا الحقل مطلوب",

  // Sidebar translations
  "sb.dashboard": "Dashboard", "sb.dashboard.ar": "لوحة القيادة",
  "sb.users": "User Management", "sb.users.ar": "إدارة المستخدمين",
  "sb.journals": "Journal Management", "sb.journals.ar": "إدارة المجلات",
  "sb.publish": "Publish Management", "sb.publish.ar": "إدارة النشر",
  "sb.submissions": "Submission Management", "sb.submissions.ar": "إدارة التقديمات",
  "sb.reviews": "Review Management", "sb.reviews.ar": "إدارة المراجعات",
  "sb.settings": "Settings", "sb.settings.ar": "الإعدادات",
  "sb.adminmenu": "Admin Menu", "sb.adminmenu.ar": "قائمة الإدارة",
  "sb.logout": "Logout", "sb.logout.ar": "تسجيل الخروج",
  "sb.associatemenu": "Associate Editor Menu", "sb.associatemenu.ar": "قائمة المحرر المساعد",
  "sb.overview": "Overview", "sb.overview.ar": "نظرة عامة",
  "sb.track": "My Track Papers", "sb.track.ar": "أبحاثي المتابعة",
  "sb.coordination": "Review Coordination", "sb.coordination.ar": "تنسيق المراجعة",
  "sb.assigned": "Assigned Submissions", "sb.assigned.ar": "التقديمات المسندة",
  "sb.authormenu": "Author Menu", "sb.authormenu.ar": "قائمة المؤلف",
  "sb.mysubmissions": "My Submissions", "sb.mysubmissions.ar": "تقديماتي",
  "sb.submitnew": "Submit New Paper", "sb.submitnew.ar": "تقديم بحث جديد",
  "sb.published": "Published Papers", "sb.published.ar": "الأبحاث المنشورة",
  "sb.accsettings": "Account Settings", "sb.accsettings.ar": "إعدادات الحساب",
  "sb.editormenu": "Editor Menu", "sb.editormenu.ar": "قائمة المحرر",
  "sb.allsubmissions": "All Submissions", "sb.allsubmissions.ar": "جميع التقديمات",
  "sb.assignreviewers": "Assign Reviewers", "sb.assignreviewers.ar": "تعيين المراجعين",
  "sb.decisions": "Decisions", "sb.decisions.ar": "القرارات",
  "sb.associates": "Associate Editors", "sb.associates.ar": "المحررين المساعدين",
  "sb.pendingreviewers": "Pending Reviewers", "sb.pendingreviewers.ar": "المراجعين المعلقين",
  "sb.reviewermenu": "Reviewer Menu", "sb.reviewermenu.ar": "قائمة المراجع",
  "sb.myassignments": "My Assignments", "sb.myassignments.ar": "مهامي",
  "sb.submitreview": "Submit Review", "sb.submitreview.ar": "تقديم المراجعة",
  "sb.history": "Review History", "sb.history.ar": "سجل المراجعات",
  "sb.myprofile": "My Profile", "sb.myprofile.ar": "الملف الشخصي",

  // Admin Dashboard translations
  "admin.overview": "Admin Overview", "admin.overview.ar": "نظرة عامة على الإدارة",
  "admin.totalusers": "Total Users", "admin.totalusers.ar": "إجمالي المستخدمين",
  "admin.submissions": "Submissions", "admin.submissions.ar": "التقديمات",
  "admin.pendingreviews": "Pending Reviews", "admin.pendingreviews.ar": "مراجعات معلقة",
  "admin.published": "Published", "admin.published.ar": "الأبحاث المنشورة",
  "admin.recentactivities": "Recent Activities", "admin.recentactivities.ar": "الأنشطة الأخيرة",
  "admin.noactivities": "No recent activities found.", "admin.noactivities.ar": "لم يتم العثور على أنشطة أخيرة.",
  "admin.quickactions": "Quick Actions", "admin.quickactions.ar": "إجراءات سريعة",
  "admin.reviewusers": "Review Pending Users", "admin.reviewusers.ar": "مراجعة المستخدمين المعلقين",
  "admin.actionneeded": "Action Needed", "admin.actionneeded.ar": "مطلوب إجراء",
  "admin.createannouncement": "Create Announcement", "admin.createannouncement.ar": "إنشاء إعلان",
  "admin.sysbackup": "System Backup", "admin.sysbackup.ar": "نسخة احتياطية للنظام",

  // Associate Editor Dashboard translations
  "ae.dashboard": "Associate Editor Dashboard", "ae.dashboard.ar": "لوحة المحرر المساعد",
  "ae.toscreen": "To Screen", "ae.toscreen.ar": "للفحص المبدئي",
  "ae.newsubmissions": "New Submissions for Screening", "ae.newsubmissions.ar": "التقديمات الجديدة للفحص",
  "ae.mytrack": "My Track Papers", "ae.mytrack.ar": "أبحاثي المتابعة",
  "ae.underreview": "Under Review", "ae.underreview.ar": "تحت المراجعة",

  // Author Dashboard translations
  "author.dashboard": "Author Dashboard", "author.dashboard.ar": "لوحة المؤلف",
  "author.totalsubmissions": "Total Submissions", "author.totalsubmissions.ar": "إجمالي التقديمات",
  "author.inreview": "In Review", "author.inreview.ar": "تحت المراجعة",
  "author.published": "Published", "author.published.ar": "الأبحاث المنشورة",
  "author.rejected": "Rejected", "author.rejected.ar": "الأبحاث المرفوضة",
  "author.mysubmissions": "My Submissions", "author.mysubmissions.ar": "تقديماتي",
  "author.submitnew": "Submit New Paper", "author.submitnew.ar": "تقديم بحث جديد",
  "author.yourpapers": "Your Research Papers", "author.yourpapers.ar": "أبحاثك العلمية",

  // Reviewer Dashboard translations
  "reviewer.dashboard": "Reviewer Dashboard", "reviewer.dashboard.ar": "لوحة المراجع",
  "reviewer.activereviews": "Active Reviews", "reviewer.activereviews.ar": "المراجعات النشطة",
  "reviewer.pendinginvitations": "Pending Invitations", "reviewer.pendinginvitations.ar": "الدعوات المعلقة",
  "reviewer.completedreviews": "Completed Reviews", "reviewer.completedreviews.ar": "المراجعات المكتملة",
  "reviewer.invitations": "Review Invitations", "reviewer.invitations.ar": "دعوات المراجعة",
  "reviewer.category": "Category", "reviewer.category.ar": "الفئة",
  "reviewer.due": "Review Due", "reviewer.due.ar": "تاريخ الاستحقاق",
  "reviewer.accept": "Accept Review", "reviewer.accept.ar": "قبول المراجعة",
  "reviewer.decline": "Decline", "reviewer.decline.ar": "رفض",
  "reviewer.assignedpapers": "Assigned Papers for Review", "reviewer.assignedpapers.ar": "الأبحاث المسندة للمراجعة",
  "reviewer.invitationaccepted": "Invitation Accepted", "reviewer.invitationaccepted.ar": "تم قبول الدعوة",
  "reviewer.invitationacceptedtext": "You have successfully accepted the review invitation.", "reviewer.invitationacceptedtext.ar": "لقد قبلت دعوة المراجعة بنجاح.",
  "reviewer.invitationdeclined": "Invitation Declined", "reviewer.invitationdeclined.ar": "تم رفض الدعوة",
  "reviewer.invitationdeclinedtext": "You have successfully declined the review invitation.", "reviewer.invitationdeclinedtext.ar": "لقد رفضت دعوة المراجعة بنجاح.",
  "reviewer.actionfailed": "Action Failed", "reviewer.actionfailed.ar": "فشلت العملية",
  "reviewer.actionfailedtext": "Could not process invitation response.", "reviewer.actionfailedtext.ar": "تعذر معالجة الاستجابة للدعوة.",

  // Settings Page translations
  "settings.title": "System Settings", "settings.title.ar": "إعدادات النظام",
  "settings.save": "Save Changes", "settings.save.ar": "حفظ التغييرات",
  "settings.general": "General Configuration", "settings.general.ar": "الإعدادات العامة",
  "settings.name": "Journal Name", "settings.name.ar": "اسم المجلة",
  "settings.email": "Contact Email", "settings.email.ar": "البريد الإلكتروني للاتصال",
  "settings.notifications": "Notification Settings", "settings.notifications.ar": "إعدادات الإشعارات",
  "settings.emailnotify": "Email notifications for new submissions", "settings.emailnotify.ar": "إشعارات البريد الإلكتروني للتقديمات الجديدة",
  "settings.weeklyreport": "Weekly summary report", "settings.weeklyreport.ar": "تقرير ملخص أسبوعي",
  "settings.rules": "Submission Rules", "settings.rules.ar": "قواعد التقديم",
  "settings.enablesubmissions": "Enable new submissions", "settings.enablesubmissions.ar": "تمكين التقديمات الجديدة",
  "settings.requireorcid": "Require ORCID for authors", "settings.requireorcid.ar": "طلب معرف ORCID للمؤلفين",
  "settings.plagiarism": "Automatic plagiarism check", "settings.plagiarism.ar": "فحص الانتحال التلقائي",
};

function getTranslation(key: string, lang: Lang): string {
  if (lang === "ar") {
    return translations[key + ".ar"] || translations[key] || key;
  }
  return translations[key] || key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("ist-lang") as Lang;
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("ist-lang", l);
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = useCallback((key: string) => getTranslation(key, lang), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageContext;
