"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

const JournalInsights = () => {
  const { lang } = useLanguage();

  const metrics = [
    {
      title: "Impact Factor",
      titleAr: "معامل التأثير",
      value: "7.97",
      desc: "2024 (Estimated)",
      descAr: "2024 (مقدر)",
    },
    {
      title: "Acceptance Rate",
      titleAr: "معدل القبول",
      value: "32%",
      desc: "Based on submissions in the last 12 months",
      descAr: "بناءً على التقديمات في آخر 12 شهرًا",
    },
    {
      title: "Time to First Decision",
      titleAr: "الوقت حتى القرار الأول",
      value: "2-3",
      desc: "Days (Average)",
      descAr: "أيام (متوسط)",
    },
    {
      title: "Time to Publication",
      titleAr: "الوقت حتى النشر",
      value: "7-10",
      desc: "Days after acceptance",
      descAr: "أيام بعد القبول",
    },
  ];

  return (
    <div className={`max-w-5xl mx-auto p-8 my-10 bg-white shadow-lg rounded-xl ${lang === "ar" ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-[#004B23] border-b-2 border-[#004B23] pb-4 mb-8">
        {lang === "en" ? "Journal Insights & Metrics" : "رؤى ومقاييس المجلة"}
      </h1>

      <p className="text-gray-700 leading-relaxed mb-10 text-lg">
        {lang === "en"
          ? "The IST Online Journal is committed to transparency and rapid dissemination of high-quality research. Below are the current performance metrics and citation statistics for the journal."
          : "تلتزم مجلة IST الإلكترونية بالشفافية والنشر السريع للأبحاث عالية الجودة. فيما يلي مقاييس الأداء وإحصائيات الاقتباس الحالية للمجلة."}
      </p>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-[#f0f9f0] border-t-4 border-[#38B000] rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-gray-600 font-semibold mb-2 h-12 flex items-center justify-center">
              {lang === "ar" ? metric.titleAr : metric.title}
            </h3>
            <div className="text-4xl font-black text-[#004B23] my-3">
              {metric.value}
            </div>
            <p className="text-xs text-gray-500">
              {lang === "ar" ? metric.descAr : metric.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Citation Sources section */}
      <div className="bg-[#fdfdfd] border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-[#1a4022] mb-6">
          {lang === "en" ? "Citation Tracking" : "تتبع الاقتباسات"}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
             <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Scholar_logo.svg/512px-Google_Scholar_logo.svg.png"
                alt="Google Scholar"
                width={192}
                height={80}
                className="w-48 object-contain"
              />
          </div>
          <div className="w-full md:w-2/3">
            <p className="text-gray-700 leading-relaxed mb-4">
              {lang === "en"
                ? "The primary citation tracking for IST Online Journal is managed through Google Scholar. Our authors enjoy high visibility, contributing to robust h-index and i10-index scores."
                : "تتم إدارة التتبع الأساسي للاقتباسات لمجلة IST الإلكترونية من خلال الباحث العلمي من جوجل. يتمتع مؤلفونا برؤية عالية، مما يساهم في تحقيق درجات قوية في مؤشر h ومؤشر i10."}
            </p>
            <a 
              href="https://scholar.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#004B23] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1a4022] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              {lang === "en" ? "View Google Scholar Profile" : "عرض ملف الباحث العلمي"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalInsights;
