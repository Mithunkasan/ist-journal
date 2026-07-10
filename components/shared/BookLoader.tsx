"use client";

import React from "react";

interface BookLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function BookLoader({ size = "md", className = "" }: BookLoaderProps) {
  const sizeClasses = {
    sm: "w-24 h-16",
    md: "w-40 h-28",
    lg: "w-56 h-40",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <svg
          className="w-full h-full text-[#004b23]"
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* The clipping path for the progress fill */}
            <clipPath id="book-fill-clip">
              <rect className="book-fill-rect" x="0" y="0" width="0" height="80" />
            </clipPath>
            
            {/* Smooth linear gradient from deep forest green to lighter lime green matching brand colors */}
            <linearGradient id="book-green-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#004b23" />
              <stop offset="50%" stopColor="#38b000" />
              <stop offset="100%" stopColor="#70e000" />
            </linearGradient>
          </defs>

          {/* 1. Muted Background Book Cover & Pages (Base outline) */}
          <g className="opacity-15">
            {/* Cover */}
            <path
              d="M60,70 C45,70 25,66 10,70 L10,15 C25,11 45,15 60,15 C75,15 95,11 110,15 L110,70 C95,66 75,70 60,70 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            {/* Spine */}
            <line x1="60" y1="15" x2="60" y2="70" stroke="currentColor" strokeWidth="4" />
            {/* Left page lines */}
            <line x1="20" y1="26" x2="50" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="36" x2="45" y2="36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="46" x2="50" y2="46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="56" x2="40" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Right page lines */}
            <line x1="70" y1="26" x2="100" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="36" x2="95" y2="36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="46" x2="100" y2="46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="56" x2="90" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* 2. Active Filled Book (Sweeping progress fill) */}
          <g clipPath="url(#book-fill-clip)">
            {/* Cover */}
            <path
              d="M60,70 C45,70 25,66 10,70 L10,15 C25,11 45,15 60,15 C75,15 95,11 110,15 L110,70 C95,66 75,70 60,70 Z"
              fill="none"
              stroke="url(#book-green-grad)"
              strokeWidth="4"
              className="glow-path"
            />
            {/* Spine */}
            <line x1="60" y1="15" x2="60" y2="70" stroke="#38b000" strokeWidth="4" />
            {/* Left page lines */}
            <line x1="20" y1="26" x2="50" y2="26" stroke="#38b000" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="36" x2="45" y2="36" stroke="#38b000" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="46" x2="50" y2="46" stroke="#38b000" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="56" x2="40" y2="56" stroke="#38b000" strokeWidth="2.5" strokeLinecap="round" />
            {/* Right page lines */}
            <line x1="70" y1="26" x2="100" y2="26" stroke="#38b000" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="36" x2="95" y2="36" stroke="#38b000" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="46" x2="100" y2="46" stroke="#38b000" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="56" x2="90" y2="56" stroke="#38b000" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* 3. Turning Pages in the center (Staggered turning page animation) */}
          <g className="turning-page page-1">
            <path
              d="M60,15 C75,15 95,11 110,15 L110,70 C95,66 75,70 60,70 Z"
              fill="#ffffff"
              stroke="#38b000"
              strokeWidth="1.5"
            />
            <line x1="65" y1="26" x2="95" y2="26" stroke="#70e000" strokeWidth="2.0" strokeLinecap="round" />
            <line x1="65" y1="36" x2="90" y2="36" stroke="#70e000" strokeWidth="2.0" strokeLinecap="round" />
            <line x1="65" y1="46" x2="95" y2="46" stroke="#70e000" strokeWidth="2.0" strokeLinecap="round" />
          </g>
          <g className="turning-page page-2">
            <path
              d="M60,15 C75,15 95,11 110,15 L110,70 C95,66 75,70 60,70 Z"
              fill="#ffffff"
              stroke="#38b000"
              strokeWidth="1.5"
            />
            <line x1="65" y1="26" x2="95" y2="26" stroke="#70e000" strokeWidth="2.0" strokeLinecap="round" />
            <line x1="65" y1="36" x2="90" y2="36" stroke="#70e000" strokeWidth="2.0" strokeLinecap="round" />
            <line x1="65" y1="46" x2="95" y2="46" stroke="#70e000" strokeWidth="2.0" strokeLinecap="round" />
          </g>
          <g className="turning-page page-3">
            <path
              d="M60,15 C75,15 95,11 110,15 L110,70 C95,66 75,70 60,70 Z"
              fill="#ffffff"
              stroke="#38b000"
              strokeWidth="1.5"
            />
            <line x1="65" y1="26" x2="95" y2="26" stroke="#70e000" strokeWidth="2.0" strokeLinecap="round" />
            <line x1="65" y1="36" x2="90" y2="36" stroke="#70e000" strokeWidth="2.0" strokeLinecap="round" />
            <line x1="65" y1="46" x2="95" y2="46" stroke="#70e000" strokeWidth="2.0" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}
