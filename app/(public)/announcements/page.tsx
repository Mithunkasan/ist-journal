"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { CircularProgress } from "@mui/material";

const AnnouncementsPage = () => {
  const { lang } = useLanguage();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/announcements");
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        }
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className={`max-w-4xl mx-auto p-8 my-10 bg-white shadow-lg rounded-xl ${lang === "ar" ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-[#004B23] border-b-2 border-[#004B23] pb-4 mb-8">
        {lang === "en" ? "Announcements & News" : "الإعلانات والأخبار"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <CircularProgress style={{ color: "#004B23" }} />
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement, idx) => (
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
      )}
      
      {!loading && announcements.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          {lang === "en" ? "No announcements at this time." : "لا توجد إعلانات في الوقت الحالي."}
        </p>
      )}
    </div>
  );
};

export default AnnouncementsPage;
