import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import CountUpStats from "@/components/landing/CountUpStats";
import ScrollRevealProvider from "@/components/landing/ScrollRevealProvider";

export const metadata = {
  title: "About -- InpromptiFy",
  description: "InpromptiFy is an AI proficiency assessment platform. We help companies measure how effectively their teams use AI.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <ScrollRevealProvider />
      <main className="bg-[#0a0a0f] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
          <div className="max-w-2xl">
            <span className="section-label">[ About ]</span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-2 text-white">
              Measuring AI proficiency,{" "}
              <span className="gradient-text">accurately</span>
            </h1>
            <p className="text-lg text-gray-400 mt-6 leading-relaxed">
              InpromptiFy was built on a simple observation: as AI transforms every
              industry, there&apos;s no reliable way to measure how well people actually
              use these tools. We&apos;re changing that.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-16">
            {[
              {
                title: "Our Mission",
                text: "To create the global standard for AI proficiency measurement. We believe that accurate assessment drives better learning, smarter hiring, and more effective teams.",
              },
              {
                title: "Our Approach",
                text: "We combine psychometric science with modern AI to build assessments that are adaptive, fair, and genuinely useful. No trivia questions -- only real-world skill validation.",
              },
              {
                title: "Our Team",
                text: "We're a team of assessment scientists, AI engineers, and product builders. Based in Australia, serving teams worldwide.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="glass-strong p-6 rounded-2xl hover:border-orange-500/10 transition-all duration-300"
              >
                <h3 className="text-base font-semibold mb-3 text-white">{card.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>

          <CountUpStats />

          <div className="mt-16 pt-10 border-t border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-6">Contact</h2>
            <p className="text-sm text-gray-400">
              General inquiries:{" "}
              <a href="mailto:hello@inpromptify.com" className="text-orange-400 hover:text-orange-300 transition-colors">
                hello@inpromptify.com
              </a>
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/signup" className="glow-btn px-6 py-2.5 text-sm text-center">
                Create Your First Assessment
              </Link>
              <Link href="/scoring" className="ghost-btn px-6 py-2.5 text-sm text-center">
                How Scoring Works
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
