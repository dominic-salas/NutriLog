import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NutriLog",
  description:
    "Snap a photo of your meal to instantly track calories, macros, and nutritional data. Your personal food log, simplified and visualized.",
  icons: {
    icon: [{ url: "/logo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/logo.jpg" }],
  },
};
export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NutriLog" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />

        <meta name="format-detection" content="telephone=no" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
