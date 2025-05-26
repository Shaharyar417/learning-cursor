'use client';
import React from "react";
import { usePathname } from "next/navigation";

export default function LayoutWithSidebar({ children }) {
    const pathname = usePathname();
    const hideSidebar = pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/register");
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            {!hideSidebar && (
                <aside className="hidden md:flex flex-col w-64 bg-[#242526] border-r border-gray-800 p-6 text-white gap-4">
                    <div className="text-2xl font-bold mb-6">MyBook</div>
                    <nav className="flex flex-col gap-3">
                        <a href="/home" className="hover:bg-[#3a3b3c] rounded px-3 py-2 transition">Home</a>
                        <a href="/profile" className="hover:bg-[#3a3b3c] rounded px-3 py-2 transition">Profile</a>
                        <a href="/friends" className="hover:bg-[#3a3b3c] rounded px-3 py-2 transition">Friends</a>
                    </nav>
                    <div className="mt-8 text-xs text-gray-400">Shortcuts</div>
                    <div className="flex flex-col gap-2 text-sm">
                        <span className="opacity-60">8 Ball Pool</span>
                        <span className="opacity-60">Candy Crush Saga</span>
                        <span className="opacity-60">Teen Patti Gold</span>
                    </div>
                </aside>
            )}
            {/* Main Content */}
            <main className="flex-1 flex flex-col">{children}</main>
        </div>
    );
}
