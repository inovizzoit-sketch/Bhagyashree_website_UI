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
          <div className="group overflow-hidden rounded-2xl border border-border-muted bg-dark-secondary transition-all hover:border-border-color">
            <div className="aspect-[4/3] w-full relative overflow-hidden">
              <img
                src="/images/hero_ayodhya.png"
                alt="Ayodhya Sarayu"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid">Luxury Residential</span>
              <h3 className="mt-2 text-xl font-bold text-text-white font-sans">Ayodhya Sarayu</h3>
              <p className="mt-2 text-sm text-text-gray-muted line-clamp-2">
                Premium residences situated next to the holy river Sarayu, blend of spiritual energy and modern grandeur.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group overflow-hidden rounded-2xl border border-border-muted bg-dark-secondary transition-all hover:border-border-color">
            <div className="aspect-[4/3] w-full relative overflow-hidden">
              <img
                src="/images/hero_brand.png"
                alt="The Sky Villas"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid">Penthouses</span>
              <h3 className="mt-2 text-xl font-bold text-text-white font-sans">The Sky Villas</h3>
              <p className="mt-2 text-sm text-text-gray-muted line-clamp-2">
                Ultra-luxurious duplex high-rises offering panoramic skyline views and private infinity pools.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group overflow-hidden rounded-2xl border border-border-muted bg-dark-secondary transition-all hover:border-border-color">
            <div className="aspect-[4/3] w-full relative overflow-hidden">
              <img
                src="/images/hero_waterfront.png"
                alt="Lumina Plaza"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid">Commercial</span>
              <h3 className="mt-2 text-xl font-bold text-text-white font-sans">Lumina Plaza</h3>
              <p className="mt-2 text-sm text-text-gray-muted line-clamp-2">
                State-of-the-art office spaces and retail avenues with smart-building automation integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Immersive Gallery Section */}
      <section className="w-full bg-dark-secondary py-12 md:py-16 border-t border-b border-border-muted">
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
