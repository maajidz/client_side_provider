import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import localFont from "next/font/local";
import "./globals.css";
import { ReduxProvider } from "./providers";

const outfit = localFont({
  src: "./fonts/Outfit-VariableFont_wght.ttf",
  variable: "--font-outfit",
});
const plusJakartaSans = localFont({
  src: "./fonts/PlusJakartaSans-VariableFont_wght.ttf",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Pomegranate - Provider",
  description: "Join Pomegranate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <ReduxProvider>
          <NextTopLoader showSpinner={false} />
          <Toaster />
          <div className="flex flex-1 w-full">{children}</div>
        </ReduxProvider>
      </body>
    </html>
  );
}
