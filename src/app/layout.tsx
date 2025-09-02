/**
 * FlavorLens - AI-Powered Recipe Discovery App
 * 
 * Created by: John Mamanao
 * Role: Software Developer
 * GitHub: @BeastNectus
 * 
 * This application transforms food images into delicious recipes
 * using advanced AI vision technology.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlavorLens - AI-Powered Recipe Discovery",
  description: "Transform any food image into delicious recipes with FlavorLens. Upload a photo and discover amazing recipes instantly. Created by John Mamanao.",
  authors: [{ name: "John Mamanao", url: "https://github.com/BeastNectus" }],
  creator: "John Mamanao",
  keywords: ["recipe", "AI", "food", "cooking", "image recognition", "FlavorLens"],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: '16x16', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ]
  },
  manifest: '/manifest.json',
  other: {
    'developer': 'John Mamanao',
    'developer-github': 'BeastNectus'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* FlavorLens - Created by John Mamanao (@BeastNectus) */}
        <meta name="developer" content="John Mamanao" />
        <meta name="developer-role" content="Software Developer" />
        <meta name="developer-github" content="BeastNectus" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
