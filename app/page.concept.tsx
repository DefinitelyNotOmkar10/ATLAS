import Link from "next/link";

const heroCards = [
  {
    title: "Pick Your Vibe",
    subtitle: "Just 3 quick answers",
    image:
      "https://images.unsplash.com/photo-1521293281845-28a8c61d01b0?auto=format&fit=crop&w=800&q=80",
    accent: "bg-[radial-gradient(circle_at_top,_rgba(255,198,109,0.55),_rgba(255,177,0,0.35)_60%,_transparent_80%)]",
  },
  {
    title: "Tailored Routes",
    subtitle: "AI-curated day plans",
    image:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80",
    accent: "bg-[radial-gradient(circle_at_center,_rgba(41,91,167,0.4),_rgba(9,34,89,0.25)_65%,_transparent_85%)]",
  },
  {
    title: "Top Spots",
    subtitle: "Stay within budget",
    image:
      "https://images.unsplash.com/photo-1470214304380-aadaedcfff84?auto=format&fit=crop&w=800&q=80",
    accent: "bg-[radial-gradient(circle_at_bottom,_rgba(6,53,89,0.65),_rgba(6,53,89,0.4)_60%,_transparent_90%)]",
  },
];

const moodTags = [
  "Island",
  "Wellness",
  "Tropical",
  "Ocean",
  "Nature",
  "Relaxation",
  "Romantic",
  "Culture",
];

const featureCards = [
  {
    id: "01",
    title: "Zero Stress Planning",
    description: "Perplexity-powered insights stitch together flights, stays, and experiences that feel handpicked.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "02",
    title: "Plans On Your Vibe",
    description: "Tell us your pace, budget, and crew—we translate it into a cinematic itinerary in minutes.",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "03",
    title: "Share & Go",
    description: "Sync plans with friends, export to your calendar, and edit on the fly from any device.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  },
];const testimonials = [
  {
    quote:
      "ATLAS gave us a Bali trip that felt like a movie montage. Five minutes to answer questions, and boom—perfection.",
    name: "Priya & Aarav",
    location: "Mumbai",
  },
  {
    quote:
      "Every day was dialled to our vibe. The AI blended hidden gems with must-see spots effortlessly.",
    name: "Lena & Markus",
    location: "Berlin",
  },
  {
    quote:
      "From sunrise treks to rooftop dinners, it nailed our group energy without endless group chats.",
    name: "Daphne Crew",
    location: "Toronto",
  },
];

export default function ConceptLandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,246,203,0.95),_rgba(6,53,89,0.05)_65%,_rgba(6,53,89,0.15)_95%)]">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(6,53,89,0.65),_rgba(255,246,203,0.55))] mix-blend-multiply" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-10">
        <Link href="/" className="text-xl font-bold tracking-tight" style={{ color: "var(--color-surface)" }}>
          ATLAS
        </Link>
        <nav className="hidden items-center gap-10 text-sm font-medium text-white/80 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>
          <a href="#testimonials" className="transition hover:text-white">
            Stories
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button
            className="hidden rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur md:block"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            Sign in
          </button>
          <Link
            href="/onboarding"
            className="rounded-full px-5 py-2 text-sm font-semibold text-[#081B29] shadow-[0_12px_30px_rgba(255,177,0,0.45)] transition hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#FFB100,#FF5AA5)" }}
          >
            Start planning
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16">
        <section className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur">
              <span>Dream trip builder</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFB100]" />
              <span>Answers in minutes</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:text-6xl">
              Get your dream trip
              <span className="mt-2 block text-3xl font-semibold text-[#C7FF57] sm:text-4xl">
                in just 3 answers
              </span>
            </h1>
            <p className="max-w-xl text-lg text-white/85">
              ATLAS blends real-time insights, weather, and your vibe to craft soulful journeys. No spreadsheets, no stress—just the itinerary you would have made if you had a week to plan.
            </p>
            <div className="flex flex-wrap gap-3">
              {moodTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 backdrop-blur transition hover:border-white hover:text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-[#081B29] shadow-[0_12px_30px_rgba(255,177,0,0.45)] transition hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg,#FFB100,#FF5AA5)" }}
              >
                Craft my itinerary
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white/85 backdrop-blur transition hover:text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                See how it works
              </Link>
            </div>
          </div>

          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute -top-6 -left-8 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(255,177,0,0.28)" }} />
            <div className="absolute -bottom-10 -right-6 h-64 w-64 rounded-full blur-3xl" style={{ background: "rgba(41,91,167,0.35)" }} />
            <div className="relative flex w-full max-w-[380px] flex-col gap-4">
              {heroCards.map((card, index) => (
                <article
                  key={card.title}
                  className={`group relative overflow-hidden rounded-3xl border border-white/15 p-4 text-white shadow-[0_25px_55px_rgba(8,27,41,0.35)] backdrop-blur ${card.accent}`}
                  style={{ transform: `translateX(${index % 2 === 0 ? "-6%" : "6%"})` }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 transition duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${card.image})` }}
                  />
                  <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
                      <span>AI guided</span>
                    </div>
                    <h3 className="text-2xl font-semibold drop-shadow">
                      {card.title}
                    </h3>
                    <p className="text-sm text-white/85">
                      {card.subtitle}
                    </p>
                    <button
                      className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/30"
                    >
                      Explore
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="rounded-4xl relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 px-8 py-14 text-white backdrop-blur">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(6,53,89,0.75),_rgba(41,91,167,0.65))] opacity-90" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">
                Why travelers switch
              </span>
              <h2 className="mt-4 text-4xl font-bold leading-tight">
                A personal trip stylist, powered by AI & real-time research
              </h2>
              <p className="mt-4 text-base text-white/85">
                We query Perplexity in the background to cross-check weather, seasonal events, crowd levels, and local favorites. Your plan is refreshed every time you revisit.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                <span className="rounded-full border border-white/25 px-4 py-2">Realtime</span>
                <span className="rounded-full border border-white/25 px-4 py-2">Weather-aware</span>
                <span className="rounded-full border border-white/25 px-4 py-2">Budget smart</span>
                <span className="rounded-full border border-white/25 px-4 py-2">Crew ready</span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {featureCards.map((card) => (
                <article
                  key={card.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-black/20 p-5 shadow-[0_20px_45px_rgba(8,27,41,0.45)]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 transition duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${card.image})` }}
                  />
                  <div className="relative z-10 flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                        {card.id}
                      </span>
                      <h3 className="mt-3 text-xl font-semibold text-white">
                        {card.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm text-white/85">
                      {card.description}
                    </p>
                    <button className="mt-6 w-max rounded-full bg-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-white/35">
                      Learn more
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="grid gap-10 rounded-3xl border border-white/15 bg-white/12 px-8 py-16 backdrop-blur">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">
              How it works
            </span>
            <h2 className="mt-4 text-4xl font-bold text-white">
              3 steps, infinite adventures
            </h2>
            <p className="mt-3 text-base text-white/85">
              Answer a micro quiz, review your tailored itinerary, and tweak anything. We regenerate in seconds so you can stay in flow.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Share your vibe",
                description: "Tell us who is coming, your pace, and the musts. We analyze thousands of data points to match the energy.",
              },
              {
                step: "02",
                title: "Review your plan",
                description: "Receive a detailed day-by-day itinerary with activities, meals, and stays that vibe with you.",
              },
              {
                step: "03",
                title: "Book & explore",
                description: "Easily adjust plans, lock in bookings, and sync across your devices for a stress-free trip.",
              },
            ].map((item) => (
              <article key={item.step} className="rounded-3xl border border-white/20 bg-white/10 p-6 text-white shadow-[0_18px_40px_rgba(8,27,41,0.35)]">
                <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">{item.step}</span>
                <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-white/85">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="testimonials" className="rounded-3xl border border-white/15 bg-white/12 px-8 py-16 backdrop-blur">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">
                Love notes
              </span>
              <h2 className="mt-4 text-4xl font-bold text-white">
                Travelers who trusted ATLAS
              </h2>
              <p className="mt-3 text-base text-white/85">
                Stories from wanderers who swapped planning chaos for effortless exploration.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <blockquote
                  key={testimonial.name}
                  className="rounded-3xl border border-white/20 bg-white/10 p-6 text-white shadow-[0_18px_40px_rgba(8,27,41,0.35)]"
                >
                  <p className="text-sm text-white/85">“{testimonial.quote}”</p>
                  <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                    {testimonial.name} • {testimonial.location}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/15 px-8 py-16 text-white backdrop-blur">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-35" />
          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              Ready when you are
            </span>
            <h2 className="text-4xl font-bold text-white">
              Tell us your travel vibe and we’ll craft the rest
            </h2>
            <p className="max-w-2xl text-base text-white/85">
              Answer three questions, pick your mood tags, and receive a personalized itinerary in under two minutes. Sync with friends, adjust instantly, and lock in your dream escape.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-[#081B29] shadow-[0_12px_30px_rgba(255,177,0,0.45)] transition hover:scale-[1.04]"
              style={{ background: "linear-gradient(135deg,#FFB100,#FF5AA5)" }}
            >
              Start the quiz
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

