import Link from "next/link";
import { HeroQuiz } from "@/components/marketing/hero-quiz";
import {
  SocialProof,
  FeaturesSection,
  StatsSection,
  UseCasesSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
} from "@/components/marketing/homepage-sections";

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
            </div>

            {/* Right — Interactive Demo Card */}
            <div>
              <HeroQuiz />
            </div>
          </div>
        </div>
      </section>

      <SocialProof />
      <FeaturesSection />
      <StatsSection />
      <UseCasesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
