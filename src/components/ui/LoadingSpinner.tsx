"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  label,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        {/* Outer ambient glow */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 blur-md opacity-40 animate-pulse-slow`}
        />
        {/* Spinning border ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-white/10 border-t-purple-500 border-r-blue-500 animate-spin relative z-10`}
          style={{ animationDuration: "0.8s" }}
        />
      </div>
      {label && (
        <p className="text-xs sm:text-sm text-gray-400 font-sans tracking-wide animate-pulse-slow">
          {label}
        </p>
      )}
    </div>
  );
}
