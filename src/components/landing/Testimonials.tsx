const testimonials = [
  {
    quote:
      "InpromptiFy transformed our hiring pipeline. We reduced time-to-hire for AI roles by 40% while improving candidate quality significantly.",
    name: "Rachel Torres",
    title: "VP Engineering, Nexus AI",
    gradient: "from-orange-500 to-red-500",
  },
  {
    quote:
      "The adaptive testing is remarkable. It accurately identified skill gaps in our engineering team that traditional assessments completely missed.",
    name: "David Kim",
    title: "CTO, Synthwave Labs",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    quote:
      "We use InpromptiFy to certify our customer-facing teams on AI product knowledge. The certification system is professional and easy to manage.",
    name: "Priya Mehta",
    title: "CPO, ScalePoint",
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    quote:
      "As an educator, I needed a tool that could assess AI literacy at scale. InpromptiFy handles 200+ students per semester without breaking a sweat.",
    name: "Marcus Johnson",
    title: "Director Education, AI Academy",
    gradient: "from-red-500 to-orange-500",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <span className="section-label">[ Testimonials ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 text-white">
            Trusted by <span className="gradient-text">industry leaders</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            See what teams are saying about InpromptiFy.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="reveal glass-strong rounded-2xl p-6 hover:border-white/[0.12] transition-all"
            >
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-bold text-white`}
                >
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">{t.name}</p>
                  <p className="text-xs text-white/30">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
