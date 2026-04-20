"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface DropdownItem {
  name: string;
  href: string;
  description?: string;
}

interface NavItem {
  name: string;
  items: DropdownItem[];
}

const navigation: NavItem[] = [
  {
    name: "Products",
    items: [
      { name: "Assessment Engine", href: "/features", description: "Adaptive AI proficiency testing" },
      { name: "Team Analytics", href: "/features#analytics", description: "Organization-wide AI readiness" },
      { name: "PromptScore", href: "/assess", description: "Standardized AI fluency credential" },
      { name: "Role Templates", href: "/features#roles", description: "Pre-built assessments by role" },
    ],
  },
  {
    name: "Developers",
    items: [
      { name: "API Reference", href: "/developers", description: "REST API + webhook docs" },
      { name: "Integrations", href: "/integrations", description: "ATS, LMS, and automation" },
      { name: "SDKs", href: "/developers#sdks", description: "TypeScript + Python quickstarts" },
      { name: "Webhooks", href: "/developers#webhooks", description: "Real-time event payloads" },
    ],
  },
  {
    name: "Updates",
    items: [
      { name: "Changelog", href: "/changelog", description: "Latest product updates" },
      { name: "Roadmap", href: "/roadmap", description: "What we are building next" },
    ],
  },
  {
    name: "Company",
    items: [
      { name: "About", href: "/about", description: "Our mission and story" },
      { name: "Pricing", href: "/pricing", description: "Plans and comparison" },
      { name: "Careers", href: "/careers", description: "Join the team" },
      { name: "Contact", href: "/contact", description: "Get in touch" },
    ],
  },
];

export function Header() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between py-3 px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="InpromptiFy"
            width={36}
            height={36}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Center nav */}
        <nav ref={navRef} className="hidden items-center md:flex">
          {navigation.map((item, index) => (
            <div key={item.name} className="relative">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                onMouseEnter={() => setOpenIndex(index)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                {item.name}
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openIndex === index && (
                <div
                  onMouseLeave={() => setOpenIndex(null)}
                  className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl p-2 shadow-2xl shadow-black/50"
                >
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      onClick={() => setOpenIndex(null)}
                      className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
                    >
                      <span className="block text-sm font-medium text-foreground">
                        {subItem.name}
                      </span>
                      {subItem.description && (
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {subItem.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/contact"
            className="text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            Book a Demo
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </header>
  );
}
