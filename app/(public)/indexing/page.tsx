"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

const indexingDatabases = [
  {
    name: "Google Scholar",
    nameAr: "الباحث العلمي من جوجل",
    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Scholar_logo.svg/512px-Google_Scholar_logo.svg.png",
    description: "The IST Online Journal is fully indexed in Google Scholar, ensuring high visibility and discoverability of published research.",
    descriptionAr: "مجلة IST الإلكترونية مفهرسة بالكامل في الباحث العلمي من جوجل، مما يضمن رؤية عالية وإمكانية اكتشاف الأبحاث المنشورة.",
  },
  {
    name: "DOAJ (Directory of Open Access Journals)",
    nameAr: "دليل المجلات المفتوحة الوصول (DOAJ)",
    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/DOAJ_logo.svg/512px-DOAJ_logo.svg.png",
    description: "Our journal meets the strict quality control standards required for inclusion in the DOAJ, promoting open science.",
    descriptionAr: "تستوفي مجلتنا معايير مراقبة الجودة الصارمة المطلوبة للإدراج في DOAJ، مما يعزز العلم المفتوح.",
    status: "Under Review",
    statusAr: "قيد المراجعة"
  },
  {
    name: "Crossref",
    nameAr: "كروس ريف (Crossref)",
    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Crossref_logo.svg/512px-Crossref_logo.svg.png",
    description: "As a member of Crossref, all articles are assigned a unique DOI (Digital Object Identifier) to ensure persistent linking.",
    descriptionAr: "بصفتنا عضواً في Crossref، يتم تعيين معرّف كائن رقمي (DOI) فريد لجميع المقالات لضمان الارتباط الدائم.",
  },
  {
    name: "Scopus",
    nameAr: "سكوبس (Scopus)",
    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Scopus_logo.svg/512px-Scopus_logo.svg.png",
    description: "The journal is actively working towards fulfilling the criteria for indexing in Elsevier's Scopus database.",
    descriptionAr: "تعمل المجلة بنشاط نحو استيفاء معايير الفهرسة في قاعدة بيانات Scopus التابعة لدار Elsevier.",
    status: "Application Pending",
    statusAr: "الطلب معلق"
  }
];

const IndexingPage = () => {
  const { lang } = useLanguage();

  return (
    <div className={`max-w-4xl mx-auto p-8 my-10 bg-white shadow-lg rounded-xl ${lang === "ar" ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-[#004B23] border-b-2 border-[#004B23] pb-4 mb-8">
        {lang === "en" ? "Abstracting and Indexing" : "التكشيف والفهرسة"}
      </h1>

      <p className="text-gray-700 leading-relaxed mb-8 text-lg">
        {lang === "en" 
          ? "IST Online Journal is committed to ensuring the widest possible dissemination of published research. We actively pursue indexing in major academic databases to maximize the visibility, reach, and impact of our authors' work."
          : "تلتزم مجلة IST الإلكترونية بضمان أوسع نشر ممكن للأبحاث المنشورة. نحن نسعى بنشاط للفهرسة في قواعد البيانات الأكاديمية الرئيسية لتحقيق أقصى قدر من الرؤية والوصول والتأثير لعمل مؤلفينا."}
      </p>

      <div className="space-y-8">
        {indexingDatabases.map((db, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-200 rounded-lg items-center bg-[#fdfdfd] hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center bg-white p-4 rounded shadow-sm">
              <Image
                src={db.imgUrl}
                alt={db.name}
                width={128}
                height={128}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1 text-center sm:text-start">
              <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                <h2 className="text-xl font-bold text-[#1a4022]">
                  {lang === "ar" ? db.nameAr : db.name}
                </h2>
                {db.status && (
                  <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    {lang === "ar" ? db.statusAr : db.status}
                  </span>
                )}
              </div>
              <p className="text-gray-700 mt-3 leading-relaxed">
                {lang === "ar" ? db.descriptionAr : db.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexingPage;
