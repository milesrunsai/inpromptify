import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080C18] border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Product */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-[13px]">
              <li><Link href="/how-it-works" className="text-gray-500 hover:text-gray-300 transition-colors">How It Works</Link></li>
              <li><Link href="/scoring" className="text-gray-500 hover:text-gray-300 transition-colors">How Scoring Works</Link></li>
              <li><Link href="/pricing" className="text-gray-500 hover:text-gray-300 transition-colors">Pricing</Link></li>
              <li><Link href="/test/demo" className="text-gray-500 hover:text-gray-300 transition-colors">Try the Demo</Link></li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2 text-[13px]">
              <li><Link href="/about" className="text-gray-500 hover:text-gray-300 transition-colors">About</Link></li>
              <li><Link href="/scoring" className="text-gray-500 hover:text-gray-300 transition-colors">How Scoring Works</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-gray-300 transition-colors">Contact</Link></li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2 text-[13px]">
              <li><Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms</Link></li>
              <li><Link href="/security" className="text-gray-500 hover:text-gray-300 transition-colors">Security</Link></li>
            </ul>
          </div>
          {/* Connect */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Connect</h4>
            <div className="flex items-center gap-3 mb-4">
              {/* X/Twitter */}
              <a href="https://x.com/Inpromptify" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-300 transition-colors" aria-label="X">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/inpromptify-ai-9474373b4/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-300 transition-colors" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              Built for teams that<br />take AI seriously.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-white/[0.04] flex items-center justify-between">
          <p className="text-[11px] text-gray-600">
            © 2026 InpromptiFy. All rights reserved.
          </p>
          <img src="/logo.png" alt="InpromptiFy" width={18} height={18} className="opacity-40" />
        </div>
      </div>
    </footer>
  );
}
