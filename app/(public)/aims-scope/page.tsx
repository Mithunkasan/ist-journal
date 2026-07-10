"use client";
import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

const AimsAndScope = () => {
  const { lang } = useLanguage();

  return (
    <div className={`max-w-4xl mx-auto p-8 my-10 bg-white shadow-lg rounded-xl ${lang === "ar" ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-[#004B23] border-b-2 border-[#004B23] pb-4 mb-6">
        {lang === "en" ? "Aims and Scope" : "الأهداف والنطاق"}
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
        <p>
          {lang === "en"
            ? "The IST Online Journal (International Journal of Current Science) is a premier, peer-reviewed, open-access academic journal dedicated to the rapid publication of high-quality research in the interdisciplinary field of Information Science and Technology."
            : "مجلة IST الإلكترونية (المجلة الدولية للعلوم الحالية) هي مجلة أكاديمية رائدة، محكّمة، ومفتوحة الوصول مكرسة للنشر السريع للأبحاث عالية الجودة في المجال متعدد التخصصات لعلوم وتقنية المعلومات."}
        </p>

        <h2 className="text-2xl font-semibold text-[#1a4022] mt-8">
          {lang === "en" ? "Our Mission" : "مهمتنا"}
        </h2>
        <p>
          {lang === "en"
            ? "Our mission is to foster innovation and knowledge sharing by providing a rigorous yet accessible platform for researchers, academicians, professionals, and students globally. We aim to bridge the gap between theoretical research and practical applications in the rapidly evolving technological landscape."
            : "تتمثل مهمتنا في تعزيز الابتكار وتبادل المعرفة من خلال توفير منصة صارمة ولكن يسهل الوصول إليها للباحثين والأكاديميين والمهنيين والطلاب على مستوى العالم. نهدف إلى سد الفجوة بين البحث النظري والتطبيقات العملية في المشهد التكنولوجي سريع التطور."}
        </p>

        <h2 className="text-2xl font-semibold text-[#1a4022] mt-8">
          {lang === "en" ? "Scope and Subject Areas" : "النطاق ومجالات الموضوعات"}
        </h2>
        <p>
          {lang === "en" ? "The journal welcomes original research articles, comprehensive review papers, case studies, and short communications spanning, but not limited to, the following domains:" : "ترحب المجلة بالمقالات البحثية الأصلية، والأوراق المرجعية الشاملة، ودراسات الحالة، والاتصالات القصيرة التي تغطي، على سبيل المثال لا الحصر، المجالات التالية:"}
        </p>
        
        <ul className="list-disc pl-8 space-y-2 mt-4 text-[#334e35]">
          <li>{lang === "en" ? "Artificial Intelligence & Machine Learning" : "الذكاء الاصطناعي والتعلم الآلي"}</li>
          <li>{lang === "en" ? "Data Science & Big Data Analytics" : "علوم البيانات وتحليل البيانات الضخمة"}</li>
          <li>{lang === "en" ? "Cybersecurity & Information Assurance" : "الأمن السيبراني وضمان المعلومات"}</li>
          <li>{lang === "en" ? "Cloud Computing & Distributed Systems" : "الحوسبة السحابية والأنظمة الموزعة"}</li>
          <li>{lang === "en" ? "Internet of Things (IoT) & Smart Technologies" : "إنترنت الأشياء (IoT) والتقنييات الذكية"}</li>
          <li>{lang === "en" ? "Software Engineering & Architecture" : "هندسة وعمارة البرمجيات"}</li>
          <li>{lang === "en" ? "Human-Computer Interaction (HCI)" : "التفاعل بين الإنسان والحاسوب (HCI)"}</li>
          <li>{lang === "en" ? "Blockchain & Cryptography" : "سلسلة الكتل (البلوك تشين) والتشفير"}</li>
          <li>{lang === "en" ? "Health Informatics & Bio-computing" : "المعلوماتية الصحية والحوسبة الحيوية"}</li>
          <li>{lang === "en" ? "Information Systems Management" : "إدارة نظم المعلومات"}</li>
        </ul>

        <p className="mt-8 italic text-gray-500 text-sm">
          {lang === "en" 
            ? "We encourage submissions that propose novel methodologies, address contemporary technical challenges, or offer significant advancements over existing state-of-the-art solutions."
            : "نحن نشجع التقديمات التي تقترح منهجيات جديدة، أو تعالج التحديات التقنية المعاصرة، أو تقدم تطورات كبيرة على الحلول الحالية الحديثة."}
        </p>
      </div>
    </div>
  );
};

export default AimsAndScope;
