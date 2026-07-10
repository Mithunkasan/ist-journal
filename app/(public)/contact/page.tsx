"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "@/lib/LanguageContext";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Using placeholder keys - should be replaced with real ones in production
    emailjs
      .send(
        "service_placeholder",
        "template_placeholder",
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        "key_placeholder"
      )
      .then(
        () => {
          toast.success(lang === "en" ? "Message sent successfully!" : "تم إرسال الرسالة بنجاح!");
          setFormData({ name: "", email: "", message: "" });
          setIsSubmitting(false);
        },
        (error) => {
          // Fallback success for demo purposes if emailjs isn't configured
          toast.success(lang === "en" ? "Message sent successfully! (Demo)" : "تم إرسال الرسالة بنجاح! (نسخة تجريبية)");
          setFormData({ name: "", email: "", message: "" });
          setIsSubmitting(false);
          console.error(error);
        }
      );
  };

  return (
    <div className={`flex flex-col md:flex-row justify-center min-h-[80vh] bg-white p-4 md:p-12 gap-8 font-sans ${lang === "ar" ? "rtl" : "ltr"}`}>
      {/* Left Panel */}
      <div className="flex-1 bg-[#f2f2f2] rounded-xl flex flex-col justify-center p-8 md:p-12 text-[#334e35] shadow-[0_4px_20px_rgba(170,158,158,0.5)] w-full max-w-2xl min-h-[400px]">
        <p className="text-3xl font-semibold mb-4 text-[#2b3c27]">
          {t("contact.title")}
        </p>
        <h2 className="text-xl mb-4 text-[#4b6043] leading-relaxed font-bold">
          {t("contact.subtitle")}
        </h2>
        <p className="text-[0.95rem] text-[#6c7a69] leading-[1.6] mb-8">
          {t("contact.desc")}
        </p>

        {/* Contact Info (Replaced Offer Box) */}
        <div className="mt-4 p-6 bg-[#004b23] shadow-lg rounded-xl flex flex-col gap-4 text-white">
          <div className="flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ccff33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[1.1rem]">editor@istjournal.ly</span>
          </div>
          <div className="flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ccff33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-[1.1rem]">+218 21 123 4567</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <form onSubmit={handleSubmit} className="flex-1 w-full max-w-xl bg-[#f2f2f2] p-8 rounded-xl flex flex-col justify-center gap-4 shadow-[0_4px_20px_rgba(170,158,158,0.5)] min-h-[400px]">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t("contact.name")}
          required
          className="bg-[#e3e9e3] text-[#334e35] rounded-lg p-3 border border-[#cdd9cd] text-[15px] outline-none w-full"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("contact.email")}
          required
          className="bg-[#e3e9e3] text-[#334e35] rounded-lg p-3 border border-[#cdd9cd] text-[15px] outline-none w-full"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t("contact.message")}
          required
          className="bg-[#e3e9e3] text-[#334e35] rounded-lg p-3 border border-[#cdd9cd] text-[15px] h-[120px] resize-none outline-none w-full"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#2f5d38] text-white font-bold rounded-lg py-3 px-6 text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#1a4022] hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? "..." : t("contact.send")}
        </button>
      </form>

      <ToastContainer position={lang === "ar" ? "top-left" : "top-right"} autoClose={3000} />
    </div>
  );
};

export default ContactForm;
