"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const boardMembers = [
  {
    name: "Prof. Dr. Ahmed Al-Mansouri",
    nameAr: "أ.د. أحمد المنصوري",
    role: "Editor-in-Chief",
    roleAr: "رئيس التحرير",
    affiliation: "Faculty of Information Technology, University of Tripoli, Libya",
    affiliationAr: "كلية تقنية المعلومات، جامعة طرابلس، ليبيا",
    email: "a.mansouri@istjournal.ly",
    scholarUrl: "https://scholar.google.com",
    cvUrl: "/cvs/prof-mansouri-cv.pdf",
    imgUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop",
  },
  {
    name: "Dr. Fatima El-Zahraa",
    nameAr: "د. فاطمة الزهراء",
    role: "Associate Editor (AI & Machine Learning)",
    roleAr: "محرر مساعد (الذكاء الاصطناعي والتعلم الآلي)",
    affiliation: "Department of Computer Science, Benghazi University, Libya",
    affiliationAr: "قسم علوم الحاسب، جامعة بنغازي، ليبيا",
    email: "f.zahraa@istjournal.ly",
    scholarUrl: "https://scholar.google.com",
    cvUrl: "/cvs/dr-fatima-cv.pdf",
    imgUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
  },
  {
    name: "Prof. Michael Chen",
    nameAr: "أ.د. مايكل تشين",
    role: "Editorial Board Member (Cybersecurity)",
    roleAr: "عضو هيئة التحرير (الأمن السيبراني)",
    affiliation: "School of Computing, National University of Singapore",
    affiliationAr: "مدرسة الحوسبة، جامعة سنغافورة الوطنية",
    email: "m.chen@nus.edu.sg",
    scholarUrl: "https://scholar.google.com",
    cvUrl: "/cvs/prof-chen-cv.pdf",
    imgUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop",
  },
  {
    name: "Dr. Sarah Johnson",
    nameAr: "د. سارة جونسون",
    role: "Editorial Board Member (Data Science)",
    roleAr: "عضو هيئة التحرير (علوم البيانات)",
    affiliation: "Institute of Technology, MIT, USA",
    affiliationAr: "معهد التكنولوجيا، معهد ماساتشوستس للتكنولوجيا، الولايات المتحدة",
    email: "s.johnson@mit.edu",
    scholarUrl: "https://scholar.google.com",
    cvUrl: "/cvs/dr-johnson-cv.pdf",
    imgUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop",
  },
];

const EditorialBoard = () => {
  const { lang } = useLanguage();

  return (
    <div className={`max-w-6xl mx-auto p-8 my-10 bg-white shadow-lg rounded-xl ${lang === "ar" ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-[#004B23] border-b-2 border-[#004B23] pb-4 mb-8">
        {lang === "en" ? "Editorial Board" : "هيئة التحرير"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {boardMembers.map((member, idx) => (
          <div key={idx} className="flex gap-6 p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-[#fdfdfd]">
            <div className="flex-shrink-0">
              <Image
                src={member.imgUrl}
                alt={member.name}
                width={100}
                height={100}
                className="rounded-full object-cover w-[100px] h-[100px] border-2 border-[#ccff33]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-bold text-[#1a4022]">
                {lang === "ar" ? member.nameAr : member.name}
              </h2>
              <p className="text-[#004b23] font-semibold mt-1">
                {lang === "ar" ? member.roleAr : member.role}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {lang === "ar" ? member.affiliationAr : member.affiliation}
              </p>
              
              <div className="mt-4 flex flex-col gap-1">
                <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {member.email}
                </a>
                <Link href={member.scholarUrl} target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lang === "en" ? "Google Scholar Profile" : "الملف الشخصي على الباحث العلمي"}
                </Link>
                <a href={member.cvUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {lang === "en" ? "Download CV" : "تحميل السيرة الذاتية"}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-[#f0f9f0] border-l-4 border-[#004B23] text-gray-700">
        <p className="italic text-sm">
          {lang === "en" 
            ? "Note: All editorial board members are recognized experts in their respective fields. The journal adheres strictly to COPE (Committee on Publication Ethics) guidelines regarding editorial independence and conflict of interest."
            : "ملاحظة: جميع أعضاء هيئة التحرير هم خبراء معترف بهم في مجالاتهم. تلتزم المجلة بصرامة بإرشادات لجنة أخلاقيات النشر (COPE) فيما يتعلق بالاستقلالية التحريرية وتضارب المصالح."}
        </p>
      </div>
    </div>
  );
};

export default EditorialBoard;
