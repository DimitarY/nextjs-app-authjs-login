import MainNav from "@/components/nav/main-nav";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex h-header w-full shrink-0 items-center px-4 md:px-6">
            <MainNav items={siteConfig.mainNav} />
          </header>
          <main className="flex-1 overflow-hidden">{children}</main>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
