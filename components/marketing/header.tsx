"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AuthModal } from "@/components/auth-modal";

interface DropdownItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  items?: DropdownItem[];
}

const navigation: NavItem[] = [
  {
    name: "Product",
    items: [
      { name: "Features", href: "/features" },
      { name: "Daily Challenge", href: "/daily" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "Pricing", href: "/pricing" },
    ],
  },
  { name: "Developers", href: "/developers" },
  {
    name: "Company",
    items: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"sign-in" | "sign-up">("sign-in");

  function openSignIn() {
    setAuthModalTab("sign-in");
    setAuthModalOpen(true);
    setMobileOpen(false);
  }

  function openSignUp() {
    setAuthModalTab("sign-up");
    setAuthModalOpen(true);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenIndex(null);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0a0a0f]/70 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 pt-5 pb-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="Inpromptify"
              width={32}
              height={32}
              className="h-6 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav ref={navRef} className="hidden md:flex items-center gap-7 ml-12">
            {navigation.map((item, index) => (
              <div key={item.name} className="relative">
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`text-[13px] tracking-wide transition-colors duration-200 ${
                      pathname === item.href ? "text-white" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      onMouseEnter={() => setOpenIndex(index)}
                      className="text-[13px] tracking-wide transition-colors duration-200 flex items-center gap-1 text-white/80 hover:text-white"
                    >
                      {item.name}
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        className={`mt-px opacity-40 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`}
                      >
                        <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {openIndex === index && item.items && (
                      <div
                        onMouseLeave={() => setOpenIndex(null)}
                        className="absolute left-0 top-full mt-3 w-48 rounded-xl bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/[0.06] py-2 shadow-2xl shadow-black/50"
                      >
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setOpenIndex(null)}
                            className="block px-4 py-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="text-[13px] text-white/80 hover:text-white transition-colors px-4 py-2"
            >
              Book a Demo
            </Link>
            <button
              onClick={openSignIn}
              className="text-[13px] text-white/80 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={openSignUp}
              className="text-[13px] font-medium text-white border border-white/20 hover:border-primary/60 hover:text-primary rounded-full px-5 py-2 transition-all duration-200"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative w-5 h-4 flex flex-col justify-between"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-px w-full bg-white transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block h-px w-full bg-white transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-full bg-white transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl">
            <div className="px-6 py-6 space-y-4">
              {navigation.map((item) =>
                item.href ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div key={item.name}>
                    <span className="block text-sm text-white/40 mb-2">{item.name}</span>
                    {item.items?.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block text-sm text-white/60 hover:text-white transition-colors pl-3 py-1"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )
              )}
              <div className="pt-4 border-t border-white/[0.06] space-y-3">
                <Link href="/contact" className="block text-sm text-white/60 hover:text-white">
                  Book a Demo
                </Link>
                <button onClick={openSignIn} className="block text-sm text-white/60 hover:text-white w-full text-left">
                  Sign In
                </button>
                <button
                  onClick={openSignUp}
                  className="text-sm font-medium text-white border border-white/20 rounded-full w-full py-2.5 block text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}
