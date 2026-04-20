import Link from "next/link";
import { HeroQuiz } from "@/components/marketing/hero-quiz";
import {
  BoldStatement,
  FeaturesSection,
  StatsSection,
  UseCasesSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
} from "@/components/marketing/homepage-sections";
import { HomepagePricing } from "@/components/marketing/homepage-pricing";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_3CVjpU5MqL28kt1M6PyOAXhNcyX/hf_20260420_060720_7b600b45-de92-47e3-b11c-619fab9fc4c5.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 via-[#0a0a0f]/80 to-[#0a0a0f]" />

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-40" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="max-w-xl">
              <div>
                <span className="section-label">[ AI Assessment Platform ]</span>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-[1.1] tracking-tight mt-4 text-white">
                  AI-Powered{" "}
                  <span className="gradient-text">Proficiency Assessment</span>
                </h1>
                <p className="mt-6 text-base sm:text-lg text-gray-400 leading-relaxed">
                  InpromptiFy is the intelligent assessment platform that measures,
                  validates, and certifies AI proficiency. Real-time scoring,
                  adaptive difficulty, and comprehensive skill mapping.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
                <Link
                  href="/sign-up"
                  className="glow-btn px-8 py-3.5 text-base inline-block text-center"
                >
                  Start Assessment
                </Link>
                <button className="ghost-btn px-8 py-3.5 text-base">
                  View Demo
                </button>
              </div>

              <p className="mt-4 text-xs text-white/30">
                No credit card required
              </p>

              {/* Share your AI capability to... */}
              <div className="mt-8">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
                  Share your AI capability to
                </p>
                <div className="flex items-center gap-4">
                  {/* X/Twitter */}
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  {/* Instagram */}
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  {/* Facebook */}
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  {/* TikTok */}
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </a>
                  {/* YouTube */}
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  {/* Threads */}
                  <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.704-.159 1.11-.488 2.084-1.005 2.895-.81 1.268-2.028 2.084-3.505 2.395-.96.203-2.39.147-3.503-.507-1.19-.698-1.903-1.89-1.903-3.326 0-1.274.587-2.403 1.653-3.177.934-.678 2.178-1.06 3.594-1.104 1.122-.034 2.14.09 3.04.37.015-.553.013-1.12-.008-1.703-.056-1.59-.455-2.374-1.22-2.394-.423-.01-.9.205-1.202.544-.27.303-.427.713-.427 1.137h-2.18c.012-1.09.427-2.06 1.17-2.735.807-.733 1.92-1.115 3.06-1.08 1.28.042 2.298.556 2.95 1.486.577.824.883 1.94.94 3.414.024.616.024 1.26.008 1.916l.015.009a4.413 4.413 0 011.454 1.15c.685.796 1.22 1.89 1.417 3.257.22 1.528-.04 3.407-1.367 4.894C18.098 22.588 15.634 23.976 12.186 24zm2.394-9.725c-.875-.027-1.622.125-2.16.44-.454.265-.684.618-.684 1.048 0 .378.157.672.468.876.387.254.882.328 1.324.25.843-.149 1.458-.586 1.834-1.301.2-.38.334-.816.396-1.313h-.002a4.544 4.544 0 00-1.176 0z"/></svg>
                  </a>
                  {/* Pinterest */}
                  <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z"/></svg>
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-orange-400 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  See where you rank on the leaderboard
                </Link>
              </div>
            </div>

            {/* Right — Interactive Demo Card */}
            <div>
              <HeroQuiz />
            </div>
          </div>
        </div>
      </section>

      <BoldStatement />
      <FeaturesSection />
      <StatsSection />
      <UseCasesSection />
      <TestimonialsSection />
      <HomepagePricing />

      <FAQSection />
      <CTASection />
    </>
  );
}
