import Link from "next/link";
import Hero from "@/modules/web/components/Hero";
import CounterSection from "@/modules/web/components/CounterSection";
import PromiseSection from "@/modules/web/components/PromiseSection";
import LegacySection from "@/modules/web/components/LegacySection";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-20">
      {/* Immersive Modular Hero Component */}
      <Hero />

      {/* Animated Counter Stats Section */}
      <CounterSection />

      {/* Stacked Promise Carousel Section */}
      <PromiseSection />

      {/* Featured Projects Summary */}
      <section className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-solid">Selected Works</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-white sm:text-4xl">Featured Developments</h2>
          </div>
          <Link href="/projects" className="mt-4 md:mt-0 text-sm font-semibold tracking-wider text-gold-solid hover:text-gold-hover transition-colors">
            View All Projects →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
           {/* Card 1 */}
          <Link href="/projects/nandeeka-purm" className="group overflow-hidden rounded-2xl border border-white/5 bg-[#050c38]/20 hover:border-gold-solid/30 transition-all shadow-xl block no-underline">
            <div className="aspect-[4/3] w-full relative overflow-hidden">
              <img
                src="https://pub-f1b7b8c7cd0c4f89ab6166efd6a0ff4b.r2.dev/1784182616610-rrl1qk.png"
                alt="Nandeeka Puram"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#020520]/25 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid">Plot Development</span>
              <h3 className="mt-2 text-xl font-bold text-white font-sans group-hover:text-gold-solid transition-colors">Nandeeka Puram</h3>
              <p className="mt-2 text-sm text-[#8E90A2] line-clamp-2 font-light leading-relaxed">
                Varanasi&apos;s premier plotting development featuring fully gated security, clear title assurances, and modern layouts.
              </p>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/projects/nandeeka-enclave" className="group overflow-hidden rounded-2xl border border-white/5 bg-[#050c38]/20 hover:border-gold-solid/30 transition-all shadow-xl block no-underline">
            <div className="aspect-[4/3] w-full relative overflow-hidden">
              <img
                src="/images/hero_brand.png"
                alt="Nandeeka Enclave"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#020520]/25 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid">Premium Residential</span>
              <h3 className="mt-2 text-xl font-bold text-white font-sans group-hover:text-gold-solid transition-colors">Nandeeka Enclave</h3>
              <p className="mt-2 text-sm text-[#8E90A2] line-clamp-2 font-light leading-relaxed">
                An elite gated community layout offering residential villa plots with top-tier utility setups in Rohaniya.
              </p>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/projects/nandeeka-heights" className="group overflow-hidden rounded-2xl border border-white/5 bg-[#050c38]/20 hover:border-gold-solid/30 transition-all shadow-xl block no-underline">
            <div className="aspect-[4/3] w-full relative overflow-hidden">
              <img
                src="/images/hero_waterfront.png"
                alt="Nandeeka Heights"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#020520]/25 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid">Commercial Space</span>
              <h3 className="mt-2 text-xl font-bold text-white font-sans group-hover:text-gold-solid transition-colors">Nandeeka Heights</h3>
              <p className="mt-2 text-sm text-[#8E90A2] line-clamp-2 font-light leading-relaxed">
                Modern corporate towers and premium retail spaces at the most high-potential commercial growth corridor of Varanasi.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Immersive Gallery Section */}
      <section className="w-full bg-[#0d153b]/10 py-16 md:py-24 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DDBD81]">Visual Experience</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Gallery & Lifestyle</h2>
            <p className="mt-4 text-sm text-[#8E90A2]">
              A glance into the state-of-the-art architectures, wellness setups, and elite clubhouses designed for modern comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Gallery Item 1 */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-muted">
              <img
                src="/images/clubhouse.png"
                alt="Elite Clubhouse"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDBD81]">Amenity</span>
                <h4 className="text-lg font-bold text-white mt-1">Elite Clubhouse</h4>
              </div>
            </div>

            {/* Gallery Item 2 */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-muted lg:translate-y-4">
              <img
                src="/images/wellness.png"
                alt="Wellness Center"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDBD81]">Health</span>
                <h4 className="text-lg font-bold text-white mt-1">Wellness Center</h4>
              </div>
            </div>

            {/* Gallery Item 3 */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-muted">
              <img
                src="/images/spiritual_club.png"
                alt="Spiritual Lounge"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDBD81]">Recreation</span>
                <h4 className="text-lg font-bold text-white mt-1">Spiritual Lounge</h4>
              </div>
            </div>

            {/* Gallery Item 4 */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-muted lg:translate-y-4">
              <img
                src="/images/amenity_saryu.png"
                alt="Sarayu Deck"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDBD81]">Nature</span>
                <h4 className="text-lg font-bold text-white mt-1">Sarayu Deck</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <LegacySection />
    </div>
  );
}
