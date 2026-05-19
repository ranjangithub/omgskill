import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { PwaRegister } from "@/components/pwa-register";
import { InstallPrompt } from "@/components/install-prompt";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "omgskill.ai — Daily AI Intelligence, Personalized", template: "%s | omgskill.ai" },
  description: "10 curated AI signals every morning, filtered through an expert enterprise lens. Personalized to your role, industry, and interests.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "omgskill.ai",
    startupImage: "/icons/icon.svg",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0f172a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <PwaRegister />
          <InstallPrompt />
        </body>
      </html>
    </ClerkProvider>
  );
}
