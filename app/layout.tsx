import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Carfolio — Your car's complete story",
  description: "A complete vehicle ownership dashboard for maintenance, costs, documents and history.",
  openGraph: {
    title: "Carfolio — Your car's complete story",
    description: "A complete vehicle ownership dashboard for maintenance, costs, documents and history.",
    siteName: "Carfolio",
    type: "website",
  },
};
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
