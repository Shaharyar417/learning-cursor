import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import React from "react";
import LayoutWithSidebar from "./components/LayoutWithSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Social Media Platform",
  description: "Connect with friends and share your thoughts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#18191a]`}>
        <Providers>
          <LayoutWithSidebar>{children}</LayoutWithSidebar>
        </Providers>
      </body>
    </html>
  );
}
