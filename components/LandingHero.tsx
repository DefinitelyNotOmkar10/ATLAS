import Link from "next/link";
import { PRODUCT_NAME, TAGLINE } from "@/lib/constants";

export default function LandingHero() {
  return (
    <section 
      className="planify-hero relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%)' }}
    >
      <div className="absolute inset-0"></div>

      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{ backgroundColor: 'var(--color-accent)' }}></div>
        <div className="absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" style={{ backgroundColor: 'var(--color-background)' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="space-y-8">
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
            style={{ color: 'var(--color-surface)' }}
          >
            {PRODUCT_NAME}
          </h1>

          <p 
            className="text-2xl sm:text-3xl lg:text-4xl font-light max-w-4xl mx-auto"
            style={{ color: 'var(--color-surface)', opacity: 0.95 }}
          >
            {TAGLINE}
          </p>

          <p 
            className="text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: 'var(--color-surface)', opacity: 0.85 }}
          >
            Transform your travel dreams into reality with intelligent itineraries 
            crafted just for you. Plan smarter, travel better.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/onboarding"
              className="planify-cta-button px-8 py-4 font-bold text-lg rounded-full transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)'
              }}
            >
              Get Started
            </Link>
          </div>

          <div className="planify-hero-illustration pt-16">
            <div 
              className="relative w-full max-w-4xl mx-auto h-64 sm:h-80 lg:h-96 backdrop-blur-sm rounded-3xl shadow-2xl flex items-center justify-center"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: '1px'
              }}
            >
              <div 
                className="text-lg font-medium"
                style={{ color: 'var(--color-surface)', opacity: 0.6 }}
              >
                [Illustration Placeholder]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


