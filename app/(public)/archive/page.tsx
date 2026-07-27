"use client";
import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

const ArchivePage = () => {
  const { lang } = useLanguage();

  const issues = [
    {
      volume: "Volume 5, Issue 4",
      volumeAr: "المجلد 5، العدد 4",
      date: "April 2024",
      dateAr: "أبريل 2024",
      articles: 12,
      status: "Latest",
      statusAr: "الأحدث"
    },
    {
      volume: "Volume 5, Issue 3",
      volumeAr: "المجلد 5، العدد 3",
      date: "March 2024",
      dateAr: "مارس 2024",
      articles: 15,
      status: "Published",
      statusAr: "تم النشر"
    },
    {
      volume: "Volume 5, Issue 2",
      volumeAr: "المجلد 5، العدد 2",
      date: "February 2024",
      dateAr: "فبراير 2024",
      articles: 10,
      status: "Published",
      statusAr: "تم النشر"
    },
    {
      volume: "Volume 5, Issue 1",
      volumeAr: "المجلد 5، العدد 1",
      date: "January 2024",
      dateAr: "يناير 2024",
      articles: 14,
      status: "Published",
      statusAr: "تم النشر"
    }
  ];

  return (
    <div className={`max-w-5xl mx-auto p-4 md:p-8 my-4 md:my-10 bg-white shadow-lg rounded-xl ${lang === "ar" ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-[#004B23] border-b-2 border-[#004B23] pb-4 mb-8">
        {lang === "en" ? "Journal Archive" : "أرشيف المجلة"}
      </h1>

      <p className="text-gray-700 leading-relaxed mb-8 text-lg">
        {lang === "en"
          ? "Browse through all previously published issues of the IST Online Journal. All articles are Open Access and available for immediate download in PDF format."
          : "تصفح جميع الأعداد المنشورة سابقًا لمجلة IST الإلكترونية. جميع المقالات مفتوحة الوصول ومتاحة للتنزيل الفوري بتنسيق PDF."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {issues.map((issue, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-6 bg-[#fdfdfd] hover:shadow-md transition-shadow relative overflow-hidden">
            {idx === 0 && (
              <div className={`absolute top-4 ${lang === "ar" ? "left-4" : "right-4"} bg-[#ccff33] text-[#004B23] text-xs font-bold px-3 py-1 rounded-full`}>
                {lang === "ar" ? issue.statusAr : issue.status}
              </div>
            )}
            <h2 className="text-2xl font-bold text-[#1a4022] mb-2">
              {lang === "ar" ? issue.volumeAr : issue.volume}
            </h2>
            <div className="flex gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {lang === "ar" ? issue.dateAr : issue.date}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {issue.articles} {lang === "en" ? "Articles" : "مقالات"}
              </span>
            </div>
            
            <Link 
              href="#" 
              className="inline-block border-2 border-[#004B23] text-[#004B23] hover:bg-[#004B23] hover:text-white px-4 py-2 rounded font-medium transition-colors"
            >
              {lang === "en" ? "View Articles" : "عرض المقالات"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchivePage;
