import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollRevealProvider from "@/components/landing/ScrollRevealProvider";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import Features from "@/components/landing/Features";
import Stats from "@/components/landing/Stats";
import UseCases from "@/components/landing/UseCases";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTASection from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <>
      <Nav transparent />
      <ScrollRevealProvider />
      <main className="bg-[#111118]">
        <Hero />
        <SocialProof />
        <Features />
        <Stats />
        <UseCases />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
