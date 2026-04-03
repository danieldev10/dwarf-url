import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DwarfURL",
  description: "Shorten long URLs, share them anywhere, and keep them organized in one library.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
