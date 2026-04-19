import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "How Scoring Works", href: "/scoring" },
    { label: "Certifications", href: "/certifications" },
    { label: "Try the Demo", href: "/test/demo" },
    { label: "AI Quiz (Free)", href: "/quiz" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Integrations", href: "/integrations" },
    { label: "Explore Tests", href: "/explore" },
    { label: "Leaderboard", href: "/leaderboard" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#06060a] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-lg font-bold tracking-tight text-white">
                Inprompti<span className="gradient-text">Fy</span>
              </span>
            </Link>
            <p className="text-xs text-white/30 leading-relaxed max-w-[200px]">
              AI-powered proficiency assessment for modern teams.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://x.com/Inpromptify" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-300 transition-colors" aria-label="X">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/inpromptify-ai-9474373b4/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-300 transition-colors" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">
                {group}
              </h4>
              <ul className="space-y-2 text-[13px]">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/30 hover:text-white/60 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] flex items-center justify-between">
          <p className="text-[11px] text-white/20">
            2026 InpromptiFy. All rights reserved.
          </p>
          <span className="text-sm font-bold tracking-tight text-white/10">
            Inprompti<span style={{ color: "rgba(249,115,22,0.15)" }}>Fy</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
