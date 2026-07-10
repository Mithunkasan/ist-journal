"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

const OpenAccess = () => {
  const { lang } = useLanguage();

  return (
    <div className={`max-w-4xl mx-auto p-8 my-10 bg-white shadow-lg rounded-xl ${lang === "ar" ? "rtl" : "ltr"}`}>
      <h1 className="text-3xl font-bold text-[#004B23] border-b-2 border-[#004B23] pb-4 mb-8">
        {lang === "en" ? "Open Access Policy" : "سياسة الوصول المفتوح"}
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
        <p>
          {lang === "en"
            ? "The IST Online Journal is fully committed to the Open Access Initiative. We strongly believe that the free and unrestricted dissemination of scientific knowledge globally accelerates the progress of science, technology, and society."
            : "تلتزم مجلة IST الإلكترونية التزامًا كاملاً بمبادرة الوصول المفتوح. نحن نؤمن إيماناً راسخاً بأن النشر الحر وغير المقيد للمعرفة العلمية على مستوى العالم يسرع من تقدم العلوم والتكنولوجيا والمجتمع."}
        </p>

        <h2 className="text-2xl font-semibold text-[#1a4022] mt-8">
          {lang === "en" ? "Creative Commons License (CC BY)" : "ترخيص المشاع الإبداعي (CC BY)"}
        </h2>
        <div className="flex items-center gap-4 my-4">
          <Image
            src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by.png"
            alt="CC-BY"
            width={88}
            height={31}
          />
        </div>
        <p>
          {lang === "en"
            ? "All articles published in our journal are distributed under the terms of the Creative Commons Attribution 4.0 International License (CC BY 4.0). This permits anyone to copy, redistribute, remix, transmit and adapt the work provided the original work and source is appropriately cited."
            : "يتم توزيع جميع المقالات المنشورة في مجلتنا بموجب شروط ترخيص المشاع الإبداعي النسبة 4.0 الدولي (CC BY 4.0). هذا يسمح لأي شخص بنسخ العمل وإعادة توزيعه ومزجه ونقله وتعديله بشرط الاستشهاد بالعمل الأصلي والمصدر بشكل مناسب."}
        </p>

        <h2 className="text-2xl font-semibold text-[#1a4022] mt-8">
          {lang === "en" ? "Author Rights" : "حقوق المؤلف"}
        </h2>
        <p>
          {lang === "en"
            ? "Under open access publishing, the authors retain the copyright of their work. Authors are free to deposit their published article in institutional and/or centrally organized repositories immediately upon publication."
            : "بموجب النشر المفتوح الوصول، يحتفظ المؤلفون بحقوق الطبع والنشر لعملهم. للمؤلفين الحرية في إيداع مقالاتهم المنشورة في المستودعات المؤسسية و/أو المنظمة مركزيًا فور النشر."}
        </p>

        <h2 className="text-2xl font-semibold text-[#1a4022] mt-8">
          {lang === "en" ? "Article Processing Charges (APC)" : "رسوم معالجة المقالات (APC)"}
        </h2>
        <p>
          {lang === "en"
            ? "To support the costs of the peer-review process, formatting, hosting, and permanent archiving, the journal charges a nominal one-time Article Processing Charge (APC) of ₹1500 INR for Indian authors and $55 USD for International authors. There are no submission fees."
            : "لدعم تكاليف عملية المراجعة، والتنسيق، والاستضافة، والأرشفة الدائمة، تفرض المجلة رسوم معالجة مقال (APC) رمزية لمرة واحدة بقيمة 1500 روبية هندية للمؤلفين الهنود و 55 دولارًا أمريكيًا للمؤلفين الدوليين. لا توجد رسوم للتقديم."}
        </p>
      </div>
    </div>
  );
};

export default OpenAccess;
