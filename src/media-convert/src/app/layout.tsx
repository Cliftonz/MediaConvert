import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Media Converter",
  description: "System to save you time ",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
