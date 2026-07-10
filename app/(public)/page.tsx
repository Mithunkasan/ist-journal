"use client";
import React from "react";
import dynamic from "next/dynamic";
import SecondaryNavbar from "@/components/layout/nav-secondary";
import Hero from "@/components/home/hero";

// Lazy load below-the-fold components to reduce initial page load JS size
const About = dynamic(() => import("@/components/home/about"), { ssr: true });
const ImportantDates = dynamic(() => import("@/components/home/importantDates"), { ssr: true });
const ChiefEditor = dynamic(() => import("@/components/home/chief-editor"), { ssr: true });
const Articles = dynamic(() => import("@/components/home/articles"), { ssr: true });
const CallForPaper = dynamic(() => import("@/components/home/call-for-paper"), { ssr: true });

export default function Home() {
  return (
    <>
      <Hero />
      <SecondaryNavbar />
      <About />
      <ImportantDates />
      <ChiefEditor />
      <Articles />
      <CallForPaper />
    </>
  );
}
