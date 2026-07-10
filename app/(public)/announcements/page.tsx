"use client";
import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

const announcementsData = [
  {
    date: "May 1, 2024",
    dateAr: "1 مايو 2024",
    title: "Call for Papers: Special Issue on AI in Healthcare",
    titleAr: "دعوة لتقديم الأبحاث: عدد خاص عن الذكاء الاصطناعي في الرعاية الصحية",
    content: "The IST Online Journal is pleased to announce a special issue focusing on the applications of Artificial Intelligence and Machine Learning in Healthcare systems. Submission deadline is July 30, 2024.",
    contentAr: "يسر مجلة IST الإلكترونية الإعلان عن عدد خاص يركز على تطبيقات الذكاء الاصطناعي والتعلم الآلي في أنظمة الرعاية الصحية. الموعد النهائي للتقديم هو 30 يوليو 2024."
  },
  {
    date: "April 15, 2024",
    dateAr: "15 أبريل 2024",
    title: "New Editorial Board Members Welcome",
    titleAr: "الترحيب بأعضاء هيئة التحرير الجدد",
    content: "We are thrilled to welcome Dr. Sarah Johnson and Prof. Michael Chen to our editorial board. Their expertise in Data Science and Cybersecurity will greatly benefit our peer-review process.",
    contentAr: "يسعدنا أن نرحب بالدكتورة سارة جونسون والبروفيسور مايكل تشين في هيئة التحرير لدينا. ستفيد خبرتهم في علوم البيانات والأمن السيبراني عملية مراجعة الأقران لدينا بشكل كبير."
  },
  {
    date: "January 10, 2024",
    dateAr: "10 يناير 2024",
    title: "Journal Awarded Higher Impact Factor",
    titleAr: "حصول المجلة على معامل تأثير أعلى",
    content: "We are proud to announce that our estimated Impact Factor for 2024 has increased to 7.97, reflecting the high quality and growing citations of the research published in our journal.",
    contentAr: "نفخر بالإعلان عن ارتفاع معامل التأثير المقدر لعام 2024 إلى 7.97، مما يعكس الجودة العالية والاقتباسات المتزايدة للأبحاث المنشورة في مجلتنا."
  }
];

const AnnouncementsPage = () => {
  const { lang } = useLanguage();

  return (
    <div className={`max-w-4xl mx-auto p-8 my-10 bg-white shadow-lg rounded-xl ${lang === "ar" ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-[#004B23] border-b-2 border-[#004B23] pb-4 mb-8">
        {lang === "en" ? "Announcements & News" : "الإعلانات والأخبار"}
      </h1>

      <div className="space-y-6">
        {announcementsData.map((announcement, idx) => (
          <div key={idx} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-[#fdfdfd]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
              <span className="bg-[#ccff33] text-[#004b23] px-3 py-1 rounded-full text-xs font-bold inline-block w-fit">
                {lang === "ar" ? announcement.dateAr : announcement.date}
              </span>
              <h2 className="text-xl font-bold text-[#1a4022]">
                {lang === "ar" ? announcement.titleAr : announcement.title}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {lang === "ar" ? announcement.contentAr : announcement.content}
            </p>
          </div>
        ))}
      </div>
      
      {announcementsData.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          {lang === "en" ? "No announcements at this time." : "لا توجد إعلانات في الوقت الحالي."}
        </p>
      )}
    </div>
  );
};

export default AnnouncementsPage;
