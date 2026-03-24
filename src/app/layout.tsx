import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/shared/Navbar";


export const metadata: Metadata = {
  title: "Ahmed Osama Fathy | Frontend Developer",
  description: "Frontend Developer specializing in React, Next.js & TypeScript. Based in Cairo, Egypt.",
  keywords: ["Frontend Developer", "React", "Next.js", "TypeScript", "Cairo", "Egypt", "Ahmed Osama"],
  authors: [{ name: "Ahmed Osama Fathy" }],
  icons: {
    icon: [
      { url: "/favicon.svg" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Ahmed Osama Fathy | Frontend Developer",
    description: "Frontend Developer specializing in React, Next.js & TypeScript.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#020617", margin: 0, padding: 0 }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
