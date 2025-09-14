import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "../styles/animations.css";
import { Providers } from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Frames - Platform for Newsletter Advertising",
  description: "The leading platform in Italy for newsletter advertising, connecting brands with creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fcfcfc" />
      </head>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Vai al contenuto principale
        </a>
        <Providers>
          <div id="main-content">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
