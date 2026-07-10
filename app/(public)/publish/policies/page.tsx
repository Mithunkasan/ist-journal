"use client";
import React, { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const policies = [
  {
    id: "editorial",
    title: "Editorial Policy",
    titleAr: "السياسة التحريرية",
    content: "The IST Online Journal employs a double-blind peer-review process. The Editor-in-Chief has full authority over the editorial content and the timing of publication.",
    contentAr: "تستخدم مجلة IST الإلكترونية عملية مراجعة الأقران المزدوجة التعمية. يتمتع رئيس التحرير بسلطة كاملة على المحتوى التحريري وتوقيت النشر.",
  },
  {
    id: "authorship",
    title: "Authorship Policy",
    titleAr: "سياسة التأليف",
    content: "Authorship should be limited to those who have made a significant contribution to the conception, design, execution, or interpretation of the reported study. All those who have made significant contributions should be listed as co-authors.",
    contentAr: "يجب أن يقتصر التأليف على أولئك الذين قدموا مساهمة كبيرة في تصور أو تصميم أو تنفيذ أو تفسير الدراسة المبلغ عنها. يجب إدراج جميع الذين قدموا مساهمات كبيرة كمؤلفين مشاركين.",
  },
  {
    id: "plagiarism",
    title: "Plagiarism Prevention Policy",
    titleAr: "سياسة منع الانتحال",
    content: "We have a strict zero-tolerance policy against plagiarism. All submitted manuscripts are screened using standard plagiarism detection software (e.g., Turnitin/iThenticate) before undergoing peer review.",
    contentAr: "لدينا سياسة صارمة بعدم التسامح مطلقًا مع الانتحال. يتم فحص جميع المخطوطات المقدمة باستخدام برنامج قياسي للكشف عن الانتحال (مثل Turnitin/iThenticate) قبل الخضوع لمراجعة الأقران.",
  },
  {
    id: "coi",
    title: "Conflict of Interest Policy",
    titleAr: "سياسة تضارب المصالح",
    content: "Authors must declare any potential conflicts of interest, financial or otherwise, that could inappropriately influence their work. Reviewers must also declare any conflicts before agreeing to review a manuscript.",
    contentAr: "يجب على المؤلفين الإعلان عن أي تضارب محتمل في المصالح، ماليًا أو غير ذلك، يمكن أن يؤثر بشكل غير لائق على عملهم. يجب على المراجعين أيضًا الإعلان عن أي تعارض قبل الموافقة على مراجعة المخطوطة.",
  },
  {
    id: "data",
    title: "Data Sharing Policy",
    titleAr: "سياسة مشاركة البيانات",
    content: "Authors are highly encouraged to share the raw data supporting their findings in public repositories, appropriately anonymized to protect patient/subject confidentiality.",
    contentAr: "يتم تشجيع المؤلفين بشدة على مشاركة البيانات الأولية التي تدعم نتائجهم في المستودعات العامة، مع إخفاء هويتهم بشكل مناسب لحماية سرية المريض/المشارك.",
  },
  {
    id: "archiving",
    title: "Content Preservation & Archiving (LOCKSS/CLOCKSS)",
    titleAr: "حفظ المحتوى والأرشفة (LOCKSS/CLOCKSS)",
    content: "The journal utilizes the LOCKSS and CLOCKSS systems to create a distributed archiving system among participating libraries, ensuring long-term preservation and restoration of digital content.",
    contentAr: "تستخدم المجلة أنظمة LOCKSS و CLOCKSS لإنشاء نظام أرشفة موزع بين المكتبات المشاركة، مما يضمن الحفاظ على المحتوى الرقمي واستعادته على المدى الطويل.",
  },
  {
    id: "ethics",
    title: "Publication Ethics & Malpractice",
    titleAr: "أخلاقيات النشر وسوء التصرف",
    content: "Our ethical guidelines are aligned with COPE (Committee on Publication Ethics). Any allegations of misconduct (data fabrication, duplicate submission, etc.) will be investigated thoroughly.",
    contentAr: "تتوافق إرشاداتنا الأخلاقية مع COPE (لجنة أخلاقيات النشر). سيتم التحقيق بدقة في أي ادعاءات بسوء السلوك (تلفيق البيانات، التقديم المزدوج، إلخ).",
  },
  {
    id: "ai",
    title: "Artificial Intelligence (AI) Usage Policy",
    titleAr: "سياسة استخدام الذكاء الاصطناعي (AI)",
    content: "AI tools (e.g., ChatGPT) cannot be listed as authors. If AI tools are used in writing, data analysis, or translation, their usage must be fully disclosed in the Methodology or Acknowledgements section.",
    contentAr: "لا يمكن إدراج أدوات الذكاء الاصطناعي (مثل ChatGPT) كمؤلفين. إذا تم استخدام أدوات الذكاء الاصطناعي في الكتابة أو تحليل البيانات أو الترجمة، فيجب الكشف عن استخدامها بالكامل في قسم المنهجية أو الشكر والتقدير.",
  },
];

const PoliciesPage = () => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState(policies[0].id);

  return (
    <div className={`max-w-6xl mx-auto p-4 sm:p-8 my-10 bg-white shadow-lg rounded-xl flex flex-col md:flex-row gap-8 ${lang === "ar" ? "rtl" : "ltr"}`}>
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-1/3 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#004B23] mb-4 pb-2 border-b-2 border-[#ccff33]">
          {lang === "en" ? "Policies & Guidelines" : "السياسات والإرشادات"}
        </h1>
        {policies.map((policy) => (
          <button
            key={policy.id}
            onClick={() => setActiveTab(policy.id)}
            className={`text-start p-3 rounded-lg transition-colors font-medium border-l-4 ${
              activeTab === policy.id
                ? "bg-[#f0f9f0] border-[#38B000] text-[#004B23]"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            {lang === "ar" ? policy.titleAr : policy.title}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="w-full md:w-2/3 p-6 bg-[#fdfdfd] border border-gray-100 rounded-lg shadow-sm h-fit min-h-[400px]">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className={activeTab === policy.id ? "block animate-fadeIn" : "hidden"}
          >
            <h2 className="text-2xl font-bold text-[#1a4022] mb-6">
              {lang === "ar" ? policy.titleAr : policy.title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {lang === "ar" ? policy.contentAr : policy.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoliciesPage;
