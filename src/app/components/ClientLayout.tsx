"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import CartSidebar from "./CartSidebar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    // Check if current path is or starts with /links (in case of subpages)
    const isLinksPage = pathname?.startsWith("/links");

    return (
        <>
            {!isLinksPage && <Navbar />}
            {!isLinksPage && <CartSidebar />}

            {/* 
        If it's the links page, we don't want the top padding (pt-20) 
        because the design is full-screen/immersive.
      */}
            <main className={isLinksPage ? "" : "pt-20"}>
                {children}
            </main>
        </>
    );
}
