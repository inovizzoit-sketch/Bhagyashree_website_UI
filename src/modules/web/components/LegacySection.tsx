import Link from "next/link";

interface LegacyItem {
  iconSvg: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

const legacyItems: LegacyItem[] = [
  {
    iconSvg: (
      // Appreciates with Assurance (Double hands holding gold growth bar graph)
      <svg className="w-10 h-10 text-[#DDBD81]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18V9m-4 9v-4m8 4v-6m-9-4l3-3 3 2 4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 17c2-2 4-3 8-3s6 1 8 3m-16 2c2-2 4-3 8-3s6 1 8 3" />
      </svg>
    ),
    title: "Appreciates with Assurance",
    subtitle: "",
    description: "Strategically located and expertly developed, branded land grows in value with confidence.",
  },
  {
    iconSvg: (
      // Build a Legacy (Detailed gold crown-head key)
      <svg className="w-10 h-10 text-[#DDBD81]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="8" cy="12" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h9m-2 0v2m-3-2v2m-4 0v2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11a1 1 0 100 2 1 1 0 000-2z" />
      </svg>
    ),
    title: "Build a Legacy",
    subtitle: "",
    description: "Future-ready land from a trusted brand built to preserve and grow wealth across generations.",
  },
  {
    iconSvg: (
      // Limitless Potential (Infinity loop wrapping growth leaf/rupee symbol)
      <svg className="w-10 h-10 text-[#DDBD81]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c-2-3.5-5.5-3.5-7.5 0s1.5 7.5 7.5 0c2 3.5 5.5 3.5 7.5 0s-1.5-7.5-7.5 0z" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    ),
    title: "Limitless Potential",
    subtitle: "",
    description: "From dream homes to retreats, branded land comes ready with infrastructure and legal clarity.",
  },
  {
    iconSvg: (
      // Secure and Stable (Detailed padlock shield with shackle details)
      <svg className="w-10 h-10 text-[#DDBD81]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="6" y="10" width="12" height="10" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 10V7a3 3 0 116 0v3M12 14v2" />
      </svg>
    ),
    title: "Secure and Stable",
    subtitle: "",
    description: "Legally vetted, tangible, and resilient branded land stands strong in any market.",
  },
  {
    iconSvg: (
      // Dual Value of Land (Gold scales balance asset balancing coins/home)
      <svg className="w-10 h-10 text-[#DDBD81]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M3 10h18M6 10l-2 5h4l-2-5zm12 0l-2 5h4l-2-5z" />
      </svg>
    ),
    title: "Dual value of Land",
    subtitle: "",
    description: "Branded land not only offers potential rental income but also acts as a powerful collateral asset.",
  },
];

export default function LegacySection() {
  return (
    <section className="w-full bg-[#020520] py-10 lg:py-16 overflow-hidden border-t border-border-muted font-sans relative">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Section Heading Header matching image style */}
        <div className="max-w-3xl mb-20 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white font-extrabold tracking-tight leading-[1.15]">
            Why Branded Land <br />
            Is The New Legacy
          </h2>
        </div>

        {/* 5-column Grid: Stacks on mobile/tablet, stretches on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 items-start">
          {legacyItems.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-start text-left animate-in fade-in slide-in-from-bottom duration-700" 
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Floating Icon Base Pedestal Vector matching image */}
              <div className="relative w-full aspect-[2/1] bg-gradient-to-b from-white/0 to-[#131322] border border-white/5 rounded-2xl flex items-center justify-center mb-8 overflow-hidden group hover:border-[#DDBD81]/30 transition-all duration-300">
                {/* Subtle internal gold gradient glow */}
                <div className="absolute inset-0 bg-[#2B153F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                  {item.iconSvg}
                </div>
                {/* Curved visual pedestal slice base */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#2B153F]/20 blur-sm rounded-b-2xl" />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                {item.title}
              </h3>

              {/* Description Body */}
              <p className="mt-4 text-xs sm:text-sm text-[#8E90A2] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
