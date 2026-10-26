import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাজার দর — প্রতিদিনের বাজারদর",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের হালনাগাদ বাজারদর জানুন সহজেই।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" data-scroll-behavior="smooth">
      <body><Suspense fallback={<div className="header-placeholder" aria-hidden="true" />}><SiteHeader /></Suspense><div className="page-content">{children}</div><SiteFooter /><Toaster position="top-center" toastOptions={{ duration: 3500 }} /></body>
    </html>
  );
}
