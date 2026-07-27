"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

const About = () => {
  const { t, lang } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row bg-white">
      {/* Left Side - Image */}
      <div className="md:w-1/2 w-full">
        <Image
          src="/uploads/journalimage.webp" // Replaced placeholder image with a realistic one
          alt="IST Journal"
          width={800}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Right Side - Content */}
      <div className="md:w-1/2 w-full p-4 md:p-8 space-y-6">
        <h2 className="text-3xl font-bold text-black">{t("aboutpage.title")}</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {t("aboutpage.desc")}
        </p>

        {/* Contact Details */}
        <div className="flex flex-col gap-4 pt-6 mt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-[#004B23]">{t("contact.title")}</h3>
          
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#004B23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-800">{lang === "ar" ? "كلية تقنية المعلومات، جامعة طرابلس" : "Faculty of Information Technology, University of Tripoli"}</p>
              <p className="text-gray-600">{lang === "ar" ? "طرابلس، ليبيا" : "Tripoli, Libya"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#004B23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-800">editor@istjournal.ly</p>
          </div>
          
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#004B23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="text-gray-800">+218 21 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;