'use client';

import { ItineraryConcept } from '@/lib/types/itinerary';
import { OnboardingData } from '@/lib/types/onboarding';
import { Sparkles, ArrowRight, Check, Compass, Flame, Crown, MapPin, Calendar, Clock } from 'lucide-react';
import { getDestinationHeroImage } from '@/lib/utils/destinationImages';

interface ConceptSelectionBoardProps {
  concepts: ItineraryConcept[];
  onboardingData: OnboardingData;
  onSelectConcept: (conceptId: string) => void;
}

const CONCEPT_THEME_IMAGES: Record<string, string> = {
  iconic: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=85',
  hidden_gems: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1000&q=85',
  luxury_leisure: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85',
};

const CONCEPT_ICONS: Record<string, any> = {
  iconic: Compass,
  hidden_gems: Flame,
  luxury_leisure: Crown,
};

export default function ConceptSelectionBoard({
  concepts,
  onboardingData,
  onSelectConcept,
}: ConceptSelectionBoardProps) {
  const destinationName = onboardingData.destination.to.city || onboardingData.destination.to.country;
  const defaultDestinationPhoto = getDestinationHeroImage(destinationName);

  return (
    <div className="animate-fadeIn space-y-10 py-6">
      {/* ── HEADER BANNER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-blue-50/70 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stage 01 • Master Blueprint Selection</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-black leading-[0.92]">
          CHOOSE YOUR <span className="text-blue-600">EXPEDITION.</span>
        </h1>

        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black/60 max-w-xl mx-auto">
          AI has curated 3 distinct travel blueprints for <span className="text-black font-black">{destinationName}</span>. Select your ideal travel philosophy to expand the complete master plan.
        </p>
      </div>

      {/* ── 3-COLUMN CONCEPT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {concepts.map((concept, index) => {
          const Icon = CONCEPT_ICONS[concept.id] || Compass;
          const coverPhoto = CONCEPT_THEME_IMAGES[concept.id] || defaultDestinationPhoto;
          const isFeatured = index === 0;

          return (
            <div
              key={concept.id}
              className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg group hover:-translate-y-1.5 hover:shadow-2xl ${
                isFeatured
                  ? 'border-blue-600 ring-2 ring-blue-600/20 bg-white'
                  : 'border-black/10 bg-white hover:border-black/30'
              }`}
            >
              {/* Top Photo Header */}
              <div className="relative h-56 w-full overflow-hidden bg-black">
                <img
                  src={coverPhoto}
                  alt={concept.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-md flex items-center gap-1.5 ${
                      isFeatured
                        ? 'bg-blue-600 text-white'
                        : 'bg-black/70 text-white border border-white/20'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {concept.badge || `Concept 0${index + 1}`}
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 text-[10px] font-bold">
                    {concept.days?.length || 1} Days
                  </span>
                </div>

                {/* Bottom Concept Title Over Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 block">
                    {concept.theme}
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight leading-tight drop-shadow-md">
                    {concept.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-medium text-black/70 leading-relaxed">
                    {concept.tagline}
                  </p>

                  {/* Pace indicator */}
                  {concept.estimated_daily_pace && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/[0.025] border border-black/5">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <div className="text-[11px] font-bold text-black/70">
                        <span className="text-black font-black uppercase text-[10px] tracking-wider block">Daily Rhythm:</span>
                        {concept.estimated_daily_pace}
                      </div>
                    </div>
                  )}

                  {/* Highlights Checklist */}
                  {concept.highlights && concept.highlights.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-black/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/40 block">
                        Signature Highlights
                      </span>
                      <ul className="space-y-1.5">
                        {concept.highlights.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs font-bold text-black/80">
                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Selection Action Button */}
                <div className="pt-4 border-t border-black/10">
                  <button
                    type="button"
                    onClick={() => onSelectConcept(concept.id)}
                    className={`w-full py-4 px-6 rounded-full font-black text-xs uppercase tracking-[0.18em] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                      isFeatured
                        ? 'bg-blue-600 text-white hover:bg-black hover:scale-[1.02]'
                        : 'bg-black text-white hover:bg-blue-600 hover:scale-[1.02]'
                    } active:scale-[0.98]`}
                  >
                    <span>Select & Expand Dossier</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
