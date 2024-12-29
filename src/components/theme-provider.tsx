"use client";

import { ThemeProviderProps } from "next-themes";
import dynamic from "next/dynamic";

// Temporary fix for https://github.com/shadcn-ui/ui/issues/5552
const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  },
);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
