const logos = [
  "OpenAI",
  "Anthropic",
  "Microsoft",
  "Google",
  "Stripe",
  "Vercel",
  "Notion",
  "Slack",
];

const doubled = [...logos, ...logos];

export function LogoMarquee() {
  return (
    <div className="w-full border-t border-border/30 pt-12 pb-8">
      <p className="mb-6 text-center text-xs uppercase tracking-widest text-muted-foreground/50">
        Trusted by teams using
      </p>
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {doubled.map((logo, i) => (
            <span
              key={`${logo}-${i}`}
              className="text-lg font-medium text-muted-foreground/50"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
