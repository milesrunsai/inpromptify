"use client";

const brands = [
  { name: "Vortex", letter: "V" },
  { name: "Nimbus", letter: "N" },
  { name: "Prysma", letter: "P" },
  { name: "Cirrus", letter: "C" },
  { name: "Kynder", letter: "K" },
  { name: "Halcyn", letter: "H" },
];

const doubledBrands = [...brands, ...brands];

export function SocialProofSection() {
  return (
    <section className="relative w-full overflow-hidden border-t border-border/30 py-16">
      <div className="max-w-5xl w-full mx-auto px-4 overflow-hidden">
        <div className="flex items-center gap-12">
          <div className="text-foreground/50 text-sm whitespace-nowrap shrink-0">
            Relied on by brands
            <br />
            across the globe
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
              {doubledBrands.map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  className="flex items-center gap-3 shrink-0"
                >
                  <div className="liquid-glass w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold text-foreground">
                    {brand.letter}
                  </div>
                  <span className="text-base font-semibold text-foreground">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
