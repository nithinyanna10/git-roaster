import type { Metadata } from "next";
import "./../styles/globals.css";

export const metadata: Metadata = {
  title: "Git Roaster v3 - Turn any repo into a story",
  description: "Analyze GitHub repositories with roast, praise, audit, and investor modes. Fact-based analysis with receipts.",
  manifest: "/manifest.json",
  themeColor: "#8b5cf6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Git Roaster",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
