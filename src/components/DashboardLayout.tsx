"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

interface TabItem {
  href: string;
  label: string;
}

const primaryTabs: TabItem[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tests", label: "Tests" },
  { href: "/dashboard/candidates", label: "Candidates" },
  { href: "/dashboard/analytics", label: "Analytics" },
];

const secondaryTabs: TabItem[] = [
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const role = (session?.user as Record<string, unknown>)?.role as string || "employer";
  const plan = (session?.user as Record<string, unknown>)?.plan as string || "free";
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
  const isAdmin = role === "admin";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  useEffect(() => { setMobileMenuOpen(false); setUserMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  const allTabs = [...primaryTabs, ...secondaryTabs];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f] border-b border-white/[0.06]">
        {/* Primary bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo + Create */}
            <div className="flex items-center gap-5">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <img src="/logo.png" alt="InpromptiFy" width={22} height={22} />
              </Link>

              {/* Desktop tabs */}
              <nav className="hidden md:flex items-center gap-0.5">
                {primaryTabs.map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                      isActive(tab.href)
                        ? "text-white bg-white/[0.06]"
                        : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/create"
                className="hidden sm:inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                New Test
              </Link>

              {/* Plan badge */}
              {plan !== "free" && (
                <span className="hidden sm:inline-flex text-[11px] font-medium text-orange-400 bg-orange-500/10 px-2 py-1 rounded capitalize">
                  {plan}
                </span>
              )}

              {/* Secondary nav links */}
              <div className="hidden lg:flex items-center gap-0.5 ml-2">
                {secondaryTabs.map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                      isActive(tab.href)
                        ? "text-white bg-white/[0.06]"
                        : "text-gray-600 hover:text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>

              {/* User menu */}
              <div className="relative ml-1" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-[11px] font-medium shrink-0">
                    {initials}
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 hidden sm:block"><path d="M6 9l6 6 6-6" /></svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0C1120] border border-white/[0.08] rounded-lg shadow-xl shadow-black/30 py-1 z-50">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-sm font-medium text-white truncate">{userName}</p>
                      <p className="text-[11px] text-gray-500 truncate">{userEmail}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium text-gray-500 bg-white/[0.04] px-1.5 py-0.5 rounded capitalize">{plan} plan</span>
                        {isAdmin && <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Admin</span>}
                      </div>
                    </div>
                    <div className="py-1">
                      <Link href="/dashboard/profile" className="block px-4 py-2 text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors">Profile</Link>
                      <Link href="/dashboard/billing" className="block px-4 py-2 text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors">Billing</Link>
                      <Link href="/dashboard/settings" className="block px-4 py-2 text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors">Settings</Link>
                      <Link href="/explore" className="block px-4 py-2 text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors">Explore Tests</Link>
                      {isAdmin && (
                        <>
                          <div className="border-t border-white/[0.06] my-1" />
                          <Link href="/admin" className="block px-4 py-2 text-[13px] text-amber-400 hover:text-amber-300 hover:bg-white/[0.03] transition-colors">Admin Panel</Link>
                        </>
                      )}
                    </div>
                    <div className="border-t border-white/[0.06] pt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-red-400 hover:bg-white/[0.03] transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#0C1120]">
            <div className="px-4 py-3 space-y-1">
              {allTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive(tab.href) ? "text-white bg-white/[0.06]" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
              <Link
                href="/dashboard/create"
                className="block px-3 py-2.5 rounded-md text-sm font-medium text-orange-400 hover:text-orange-300"
              >
                + New Test
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page content — full width */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
