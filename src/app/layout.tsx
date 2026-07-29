import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/useAuth";
import DevRoleSwitcher from "@/components/DevRoleSwitcher";

export const metadata: Metadata = {
  title: "OrphanConnect",
  description: "Connecting lesser-known orphanages with donors and volunteers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col text-gray-800">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <DevRoleSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}