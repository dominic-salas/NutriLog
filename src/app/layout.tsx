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
      {/* For extra safety you can also pre-render these two so client & server match:
          className="js-focus-visible" data-js-focus-visible=""
          but suppressHydrationWarning is usually enough. */}
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        {/* (Optional) Better results if you also provide a 32x32 PNG: 
            <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" /> */}
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
