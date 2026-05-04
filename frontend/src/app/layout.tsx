import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Virlo — URL to Viral UGC Video in 60 Seconds",
  description:
    "Paste any product URL. Our Intelligence Engine writes the script, renders a hyper-realistic avatar, and stitches cinematic B-roll. Your competitor doesn't have this.",
  keywords: "UGC video, AI video generator, TikTok ads, viral video",
  openGraph: {
    title: "Virlo — URL to Viral Video in 60 Seconds",
    description: "AI-powered UGC video factory. Smart Scripts · Cinematic B-roll · Seamless Assembly.",
    url: "https://virloai.vercel.app",
    siteName: "Virlo",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
