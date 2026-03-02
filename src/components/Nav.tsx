"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const menuGroups = [
  {
    label: "Product",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "How Scoring Works", href: "/scoring" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Nav({ transparent = false }: { transparent?: boolean }) {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = !!session?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isDark = transparent;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-[#0A0F1C]/95 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-white/95 backdrop-blur-xl shadow-sm"
          : isDark
            ? "bg-transparent"
            : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 group">
            <span className={`font-mono text-lg tracking-tight select-none ${isDark ? "text-white" : "text-gray-900"}`}>
              <span className="text-indigo-500 font-normal opacity-60 group-hover:opacity-100 transition-opacity">[</span>
              <span className="font-semibold">Inprompti</span>
              <span className="font-semibold text-indigo-400">F</span>
              <span className="font-semibold">y</span>
              <span className="text-indigo-500 font-normal opacity-60 group-hover:opacity-100 transition-opacity">]</span>
            </span>
          </Link>

          {/* Desktop: dropdown + auth */}
          <div className="hidden md:flex items-center gap-1">
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`text-[13px] px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Menu
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen && (
                <div
                  className={`absolute top-full left-0 mt-2 w-56 rounded-lg border shadow-xl ${
                    isDark
                      ? "bg-[#0C1120] border-white/[0.08] shadow-black/40"
                      : "bg-white border-gray-200 shadow-gray-200/50"
                  }`}
                >
                  <div className="py-2">
                    {menuGroups.map((group, i) => (
                      <div key={group.label}>
                        {i > 0 && (
                          <div className={`mx-3 my-1.5 h-px ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`} />
                        )}
                        <p
                          className={`px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider ${
                            isDark ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {group.label}
                        </p>
                        {group.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`block px-4 py-1.5 text-[13px] transition-colors ${
                              isDark
                                ? "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className={`mx-2 h-4 w-px ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className={`text-[13px] font-medium px-4 py-1.5 rounded-md transition-all ${
                  isDark
                    ? "text-white bg-indigo-600 hover:bg-indigo-500"
                    : "text-white bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-[13px] px-3 py-1.5 rounded transition-colors ${
                    isDark ? "text-gray-500 hover:text-gray-200" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className={`text-[13px] font-medium px-4 py-1.5 rounded-md transition-all ${
                    isDark
                      ? "text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.08] hover:border-white/[0.16]"
                      : "text-gray-900 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className={`md:hidden p-1.5 rounded ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span
                className={`block h-[1.5px] rounded-full transition-all duration-200 bg-current ${
                  mobileOpen ? "rotate-45 translate-y-[3.25px]" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] rounded-full transition-all duration-200 bg-current ${
                  mobileOpen ? "-rotate-45 -translate-y-[3.25px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`px-5 pb-4 pt-2 space-y-1 ${isDark ? "border-t border-white/[0.04]" : "border-t border-gray-100"}`}>
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className={`text-[10px] font-semibold uppercase tracking-wider pt-3 pb-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                {group.label}
              </p>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-sm py-1.5 ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div className={`h-px my-2 ${isDark ? "bg-white/[0.04]" : "bg-gray-100"}`} />
          {isLoggedIn ? (
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={`block text-sm py-2 font-medium ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className={`block text-sm py-2 ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                Log in
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className={`block text-sm py-2 font-medium ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
