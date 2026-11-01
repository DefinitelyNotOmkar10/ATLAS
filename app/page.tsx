"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtlasLogo } from "@/components/ui/AtlasLogo";
import { useAuth } from "@/lib/hooks/useAuth";
import { TravelScrollZoominAnimation } from "@/components/ui/travel-scroll-zoomin-animation";
import { 
  ArrowUpRight, 
  Sparkles, 
  Compass, 
  MapPin, 
  Calendar, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Bookmark, 
  LogOut, 
  ChevronDown,
  Globe2,
  Zap,
  ArrowRight
} from "lucide-react";

const moodTags = [
  "Island",
  "Adventure",
  "Wellness",
  "Family",
  "Romantic",
  "Culture",
  "Nature",
  "Food & Dining",
  "Nightlife",
];

const featureCards = [
  {
    id: "01",
    tag: "REAL-TIME RESEARCH",
    title: "Zero Stress Planning",
    description:
      "Gemini & Perplexity knowledge synthesis cross-references activities, top-rated restaurants, and local hidden gems in real-time.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "02",
    tag: "SMART ALLOCATION",
    title: "Budget & Pace Aware",
    description:
      "Strict 60% lodging allocation formula and custom pacing guarantee every hotel and activity matches your exact budget and travel rhythm.",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "03",
    tag: "DYNAMIC ROUTES",
    title: "Multi-Modal Journeys",
    description:
      "Road journeys automatically generate scenic waypoint stops; flights, trains, and buses provide direct booking platform recommendations.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "04",
    tag: "OFFLINE EXPORT",
    title: "Offline PDF Ready",
    description:
      "Download your complete multi-day schedule as a high-resolution, print-ready PDF to navigate remote areas with zero cell signal.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  },
];

const testimonials = [
  {
    quote:
      "ATLAS turned our chaotic European multi-city tour into a cinematic journey. In 2 minutes, we had the exact breakfast spots and morning sights mapped out.",
    author: "Elena Rostova",
    role: "Architect & Explorer",
    city: "Vienna",
  },
  {
    quote:
      "The budget calculation is remarkably accurate. The hotel recommendations stayed strictly within our limit while finding genuine boutique gems.",
    author: "Marcus Chen",
    role: "Digital Nomad",
    city: "Singapore",
  },
  {
    quote:
      "The road trip journey stops feature is incredible. Found scenic mountain forts on our drive we would have completely bypassed otherwise.",
    author: "Aarav & Priya",
    role: "Travel Photographers",
    city: "Mumbai",
  },
];

export default function Home() {
  const { user, username, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const initials = username ? username.slice(0, 2).toUpperCase() : "?";

  async function handleSignOut() {
    await signOut();
    setDropdownOpen(false);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* ── STICKY EDITORIAL TOP NAVIGATION ── */}
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Logo & Brand */}
          <Link href="/" aria-label="Atlas home">
            <AtlasLogo size="md" />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.18em] text-black/70 md:flex">
            <a href="#features" className="transition hover:text-blue-600">
              Intelligence
            </a>
            <a href="#how-it-works" className="transition hover:text-blue-600">
              How It Works
            </a>
            <a href="#stories" className="transition hover:text-blue-600">
              Stories
            </a>
          </nav>

          {/* Right Auth / Action */}
          <div className="flex items-center gap-4">
            {user ? (
              /* User Menu */
              <div className="relative">
                <button
                  id="user-menu-button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-full border border-black/15 bg-black/[0.04] pl-2 pr-4 py-1.5 transition hover:bg-black/[0.08]"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white text-xs font-black">
                    {initials}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-black max-w-[120px] truncate">
                    {username}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-black/60 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-black/10 bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.15)] z-50">
                      <div className="border-b border-black/10 px-3 py-2.5 mb-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-black/50">Signed in as</p>
                        <p className="mt-0.5 text-xs font-black text-black truncate">{username}</p>
                      </div>
                      <Link
                        href="/saved-trips"
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-wider text-black/80 transition hover:bg-black/5 hover:text-black"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Bookmark className="h-4 w-4 text-blue-600" />
                        Saved Trips
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-wider text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Guest Options */
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="hidden md:inline-flex px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black/80 transition hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white font-black text-xs uppercase tracking-[0.18em] transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-md"
                >
                  <span>Start Planning</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION: BOLD EDITORIAL HEADLINE ── */}
      <section className="relative w-full overflow-hidden border-b border-black/10 bg-white px-6 pt-16 pb-20 md:pt-24 md:pb-28 lg:px-12">
        {/* Background Subtle Watermark */}
        <div className="absolute -top-10 right-0 pointer-events-none opacity-[0.03] select-none">
          <span className="text-[28vw] font-black uppercase tracking-tighter text-black leading-none">
            VOYAGE
          </span>
        </div>

        <div className="mx-auto max-w-7xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-black/15 bg-black/[0.02] text-[11px] font-black uppercase tracking-[0.25em] text-black/70 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-POWERED TRIP INTELLIGENCE</span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span>ZERO STRESS</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div className="space-y-8">
              <h1 className="text-[12vw] sm:text-[9vw] md:text-[6.5rem] lg:text-[7.5rem] font-black uppercase leading-[0.88] tracking-[-0.04em] text-black select-none">
                YOUR TRIP. <br />
                <span className="text-blue-600 font-black">CRAFTED IN</span> <br />
                MINUTES.
              </h1>

              <p className="max-w-2xl text-base sm:text-lg md:text-xl font-bold uppercase tracking-wider text-black/80 leading-relaxed">
                Ditch the 40 open tabs and spreadsheet chaos. Answer a few questions about your vibe and budget, and our AI constructs a <span className="text-blue-600 font-black">cinematic, day-by-day itinerary</span> with verified hotels, local eats, and unforgettable moments.
              </p>

              {/* Mood Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {moodTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/15 bg-black/[0.02] px-4 py-2 text-xs font-black uppercase tracking-wider text-black/70 transition hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-xl"
                >
                  <span>Build My Itinerary</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                {user ? (
                  <Link
                    href="/saved-trips"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-black/20 text-black font-black text-xs uppercase tracking-[0.2em] transition hover:border-black hover:bg-black/5"
                  >
                    <Bookmark className="w-4 h-4 text-blue-600" />
                    <span>Saved Trips</span>
                  </Link>
                ) : (
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-black/20 text-black font-black text-xs uppercase tracking-[0.2em] transition hover:border-black hover:bg-black/5"
                  >
                    <span>See How It Works</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Architectural Preview Card */}
            <div className="relative">
              <div className="relative rounded-3xl border border-black/15 bg-black/[0.02] p-6 sm:p-8 overflow-hidden">
                {/* Corner Marks */}
                <div className="absolute top-3 left-3 text-black/40 font-mono text-xs">+</div>
                <div className="absolute top-3 right-3 text-black/40 font-mono text-xs">+</div>
                <div className="absolute bottom-3 left-3 text-black/40 font-mono text-xs">+</div>
                <div className="absolute bottom-3 right-3 text-black/40 font-mono text-xs">+</div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <span className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">
                      LIVE ENGINE SPEC
                    </span>
                    <span className="text-[10px] font-mono font-bold text-black/50">
                      VERSION 0.1.0
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white text-xs font-black">
                        01
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider text-black">
                          Search-Grounded LLM
                        </h4>
                        <p className="text-xs font-bold text-black/60 mt-0.5">
                          Multi-query real-time validation across activities, hotels, and dining.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white text-xs font-black">
                        02
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider text-black">
                          Deterministic Budgeting
                        </h4>
                        <p className="text-xs font-bold text-black/60 mt-0.5">
                          Guaranteed 60% per-night accommodation cap to eliminate overpricing.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white text-xs font-black">
                        03
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider text-black">
                          Offline PDF Generation
                        </h4>
                        <p className="text-xs font-bold text-black/60 mt-0.5">
                          Client-side A4 export with full itinerary details and maps.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-black p-4 text-white">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                      <span>Ready to experience?</span>
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker / Metrics Bar */}
        <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-black/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border-l-2 border-black pl-4">
              <p className="text-2xl sm:text-3xl font-black uppercase text-black">100%</p>
              <p className="text-[11px] font-black uppercase tracking-wider text-black/50 mt-1">Real-Time Researched</p>
            </div>
            <div className="border-l-2 border-blue-600 pl-4">
              <p className="text-2xl sm:text-3xl font-black uppercase text-blue-600">3-5 Min</p>
              <p className="text-[11px] font-black uppercase tracking-wider text-black/50 mt-1">Ready-Made Schedule</p>
            </div>
            <div className="border-l-2 border-black pl-4">
              <p className="text-2xl sm:text-3xl font-black uppercase text-black">30 Days</p>
              <p className="text-[11px] font-black uppercase tracking-wider text-black/50 mt-1">Client Caching</p>
            </div>
            <div className="border-l-2 border-black pl-4">
              <p className="text-2xl sm:text-3xl font-black uppercase text-black">Offline</p>
              <p className="text-[11px] font-black uppercase tracking-wider text-black/50 mt-1">PDF Download</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CINEMATIC SCROLL ZOOM DIVE PORTAL ── */}
      <TravelScrollZoominAnimation />

      {/* ── FEATURES SECTION: ARCHITECTURAL 4-COLUMN GRID ── */}
      <section id="features" className="relative w-full bg-white text-black border-b border-black/10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 block mb-3">
                INTELLIGENT TRAVEL ARCHITECTURE
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-black">
                WHY TRAVELERS SWITCH TO ATLAS.
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm font-bold uppercase tracking-wider text-black/70">
              No generic top-10 lists. ATLAS crafts tailored days that match your energy, budget, and travel companions.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card) => (
              <article
                key={card.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-black/15 bg-black/[0.02] p-6 transition-all duration-300 hover:border-black hover:bg-white hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
              >
                {/* Registration crosshairs */}
                <div className="absolute top-3 left-3 text-black/30 font-mono text-xs">+</div>
                <div className="absolute top-3 right-3 text-black/30 font-mono text-xs">+</div>

                <div>
                  <div className="flex items-center justify-between mb-6 pt-2">
                    <span className="text-2xl font-black text-black">{card.id}</span>
                    <span className="rounded-full border border-black/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600">
                      {card.tag}
                    </span>
                  </div>

                  <div className="relative h-44 w-full overflow-hidden rounded-2xl mb-6 bg-black/5">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover grayscale contrast-125 transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>

                  <h3 className="text-xl font-black uppercase tracking-tight text-black mb-3">
                    {card.title}
                  </h3>
                  <p className="text-xs font-bold leading-relaxed text-black/70 uppercase tracking-wide">
                    {card.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/50 group-hover:text-blue-600 transition-colors">
                    Explore Engine
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-black/40 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS: 3-STEP PIPELINE ── */}
      <section id="how-it-works" className="relative w-full bg-white text-black border-b border-black/10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 block mb-3">
              SIMPLE 3-STEP WORKFLOW
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-black mb-6">
              FROM CONCEPT TO ITINERARY.
            </h2>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black/70">
              Answer quick prompts, let our AI synthesize real-time data, and hit the road with a complete schedule.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Share Your Vibe",
                description:
                  "Pick who's coming, dates, departure/destination, travel pace, and budget limits. No endless forms required.",
              },
              {
                step: "02",
                title: "AI Synthesizes Itinerary",
                description:
                  "Our engine runs parallel searches for activities, dining, and hotels, crafting an hour-by-hour itinerary with costs.",
              },
              {
                step: "03",
                title: "Download & Explore",
                description:
                  "Access your trip from your account or export a high-res PDF for seamless offline navigation across the globe.",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="relative rounded-3xl border border-black/15 bg-black/[0.02] p-8 flex flex-col justify-between transition hover:border-black hover:bg-white hover:shadow-lg"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl sm:text-5xl font-black text-black">
                      {item.step}
                    </span>
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-black">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wide leading-relaxed text-black/70">
                    {item.description}
                  </p>
                </div>

                <div className="mt-10 pt-4 border-t border-black/10 text-[10px] font-black uppercase tracking-widest text-black/40">
                  PHASE {idx + 1} OF 3
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORIES / TESTIMONIALS SECTION ── */}
      <section id="stories" className="relative w-full bg-white text-black border-b border-black/10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 block mb-3">
                FIELD REPORTS & STORIES
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-black">
                VOICES FROM THE ROAD.
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm font-bold uppercase tracking-wider text-black/70">
              Trusted by solo backpackers, couples on honeymoons, and family coordinators worldwide.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <blockquote
                key={idx}
                className="relative rounded-3xl border border-black/15 bg-black/[0.02] p-8 flex flex-col justify-between transition hover:border-black hover:bg-white"
              >
                <div className="space-y-4">
                  <span className="text-3xl font-black text-blue-600 font-serif leading-none">“</span>
                  <p className="text-sm font-bold uppercase tracking-wide text-black/85 leading-relaxed">
                    {t.quote}
                  </p>
                </div>

                <footer className="mt-8 pt-4 border-t border-black/10">
                  <p className="text-xs font-black uppercase tracking-wider text-black">{t.author}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-black/50">
                    {t.role} • {t.city}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL HIGH-IMPACT CALL TO ACTION ── */}
      <section className="relative w-full bg-black text-white px-6 py-28 lg:px-12 overflow-hidden selection:bg-white selection:text-black">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <span className="text-[25vw] font-black uppercase tracking-tighter text-white">
            ATLAS
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.25em] text-white/70">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>READY WHEN YOU ARE</span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.88] tracking-[-0.04em] text-white">
            TELL US YOUR VIBE. <br />
            <span className="text-blue-500 font-black">WE’LL PLAN THE REST.</span>
          </h2>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base uppercase font-bold tracking-wider text-white/80 leading-relaxed">
            Answer a few quick questions and receive your full personalized itinerary in under two minutes. Save it to your account or download as a PDF for offline freedom.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 shadow-2xl"
            >
              <span>Launch Itinerary Builder</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MINIMALIST EDITORIAL FOOTER ── */}
      <footer className="w-full border-t border-black/10 bg-white px-6 py-12 lg:px-12 text-black">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <AtlasLogo size="sm" showSubtitle={false} />
            <span className="text-xs font-bold text-black/40">
              © {new Date().getFullYear()} AI-POWERED TRIP PLANNER.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-black uppercase tracking-wider text-black/60">
            <Link href="/onboarding" className="hover:text-blue-600 transition-colors">
              Builder
            </Link>
            <Link href="/saved-trips" className="hover:text-blue-600 transition-colors">
              Saved Trips
            </Link>
            <Link href="/auth/login" className="hover:text-blue-600 transition-colors">
              Account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
