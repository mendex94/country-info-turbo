import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Country Info",
  description: "Get information about countries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <Link href="/" className="text-xl font-bold">
            Country Info
          </Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
