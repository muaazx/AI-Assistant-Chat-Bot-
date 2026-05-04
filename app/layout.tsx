import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Bot } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Knowledge AI - Your Intelligent Assistant",
  description: "AI-powered chat assistant with specialized knowledge",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        
        {/* Floating Cartoon Robot Icon (replaces the Next.js Dev Indicator position) */}
        <div className="fixed bottom-5 left-5 z-[100] p-3.5 bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-110 hover:-rotate-12 transition-all duration-300 rounded-2xl shadow-[0_8px_30px_rgb(99,102,241,0.4)] border border-white/20 flex items-center justify-center cursor-help group" title="Knowledge AI Chatbot">
          <Bot className="h-6 w-6 text-white group-hover:animate-pulse" strokeWidth={2.5} />
        </div>
      </body>
    </html>
  );
}
