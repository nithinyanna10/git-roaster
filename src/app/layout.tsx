import type { Metadata } from "next";
import "./../styles/globals.css";

export const metadata: Metadata = {
  title: "Git Roaster v3 - Turn any repo into a story",
  description: "Analyze GitHub repositories with roast, praise, audit, and investor modes. Fact-based analysis with receipts.",
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
