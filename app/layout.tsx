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
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="mx-auto w-full max-w-6xl border-t border-white/[0.06] px-6 py-6 text-xs font-medium leading-6 text-[#6a6b6c] sm:px-10 lg:px-12">
          Theme inspired by{" "}
          <a
            className="ray-link font-semibold"
            href="https://github.com/VoltAgent/awesome-design-md"
            rel="noreferrer"
            target="_blank"
          >
            awesome-design-md
          </a>
          .
        </footer>
      </body>
    </html>
  );
}
