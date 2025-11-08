import "@/styles/globals.css";

import { type Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/retroui/Sonner";

export const metadata: Metadata = {
  title: "ClarifAI",
  description: "A web-based study companion powered by AI.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${archivoBlack.variable} ${space.variable}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
