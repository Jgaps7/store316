import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/app/components/Navbar";
import CartSidebar from "@/app/components/CartSidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store 316 | Exclusive Catalog",
  description: "Experience luxury. Exclusive catalog of Store 316.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-black text-white min-h-screen`}
      >
        <Providers>
          {/* IMPORTANTE: Navbar e CartSidebar devem estar aqui dentro.
             Como o CartSidebar não recebe mais props, o erro ts(2739) sumirá.
          */}
          <Navbar />
          <CartSidebar />

          <main className="pt-20">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}