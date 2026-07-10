"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

const ConferencePage = () => {
  const { lang } = useLanguage();

  const conferences = [
    {
      title: "1st International Conference on Advanced Information Technology",
      titleAr: "المؤتمر الدولي الأول لتكنولوجيا المعلومات المتقدمة",
      date: "October 15-17, 2024",
      dateAr: "15-17 أكتوبر 2024",
      location: "Tripoli, Libya (Hybrid)",
      locationAr: "طرابلس، ليبيا (هجين)",
      desc: "Join researchers and industry experts to discuss the latest advancements in AI, Cybersecurity, and Cloud Computing. Selected papers will be published in a special issue of the IST Online Journal.",
      descAr: "انضم إلى الباحثين وخبراء الصناعة لمناقشة أحدث التطورات في الذكاء الاصطناعي والأمن السيبراني والحوسبة السحابية. سيتم نشر الأبحاث المختارة في عدد خاص من مجلة IST الإلكترونية."
    }
  ];

  return (
    <div className={`max-w-5xl mx-auto p-8 my-10 bg-white shadow-lg rounded-xl ${lang === "ar" ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-[#004B23] border-b-2 border-[#004B23] pb-4 mb-8">
        {lang === "en" ? "Conferences & Events" : "المؤتمرات والفعاليات"}
      </h1>

      <p className="text-gray-700 leading-relaxed mb-8 text-lg">
        {lang === "en"
          ? "IST Online Journal partners with leading academic institutions to host and sponsor international conferences. Explore our upcoming events below."
          : "تتعاون مجلة IST الإلكترونية مع المؤسسات الأكاديمية الرائدة لاستضافة ورعاية المؤتمرات الدولية. استكشف أحداثنا القادمة أدناه."}
      </p>

      <div className="space-y-8">
        {conferences.map((conf, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
            <div className="w-full md:w-1/3 bg-[#f2f2f2] flex items-center justify-center p-6 relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center"></div>
              <div className="z-10 text-center">
                <span className="block text-4xl font-black text-[#004B23] mb-2">{lang === "en" ? "Oct" : "أكتوبر"}</span>
                <span className="block text-2xl font-bold text-[#38B000]">15-17</span>
                <span className="block text-lg font-medium text-gray-600 mt-2">2024</span>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-[#1a4022] mb-3">
                {lang === "ar" ? conf.titleAr : conf.title}
              </h2>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ccff33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {lang === "ar" ? conf.dateAr : conf.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ccff33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {lang === "ar" ? conf.locationAr : conf.location}
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                {lang === "ar" ? conf.descAr : conf.desc}
              </p>
              
              <button className="self-start bg-[#004B23] text-white px-6 py-2 rounded-md font-medium hover:bg-[#1a4022] transition-colors">
                {lang === "en" ? "Learn More & Register" : "معرفة المزيد والتسجيل"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConferencePage;
