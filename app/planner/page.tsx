"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { OnboardingData } from '@/lib/types/onboarding';
import { DayItinerary, ItineraryConcept, ItineraryResponse, JourneyStop } from '@/lib/types/itinerary';
import LoadingState from '@/components/planner/LoadingState';
import GeneratingState from '@/components/planner/GeneratingState';
import ErrorState from '@/components/planner/ErrorState';
import StreamingIndicator from '@/components/planner/StreamingIndicator';
import TripHeader from '@/components/planner/TripHeader';
import DayCard from '@/components/planner/DayCard';
import HotelCard from '@/components/planner/HotelCard';
import JourneyStopsCard from '@/components/planner/JourneyStopsCard';
import TransportBookingsCard from '@/components/planner/TransportBookingsCard';
import ConceptSelectionBoard from '@/components/planner/ConceptSelectionBoard';
import { createClient, isSupabaseConfigured } from '@/lib/client';
import { AtlasLogo } from '@/components/ui/AtlasLogo';
import { ArrowLeft, Bookmark, AlertTriangle, Sparkles, Layers } from 'lucide-react';

export default function PlannerPage() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [concepts, setConcepts] = useState<ItineraryConcept[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [parsedDays, setParsedDays] = useState<DayItinerary[]>([]);
  const [journeyStops, setJourneyStops] = useState<JourneyStop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [error, setError] = useState('');
  const itineraryRef = useRef<HTMLDivElement>(null);

  const selectedConcept = concepts.find((c) => c.id === selectedConceptId) || null;

  const handleDownloadPdf = async () => {
    if (!onboardingData || !itineraryRef.current || typeof window === 'undefined') return;

    const toCity = onboardingData.destination.to.city || 'trip';
    const safeCity = toCity
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40);
    const conceptTag = selectedConcept ? `-${selectedConcept.id}` : '';
    const filename = `Atlas-${safeCity || 'trip'}${conceptTag}.pdf`;

    setIsPdfGenerating(true);
    try {
      const { toCanvas } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      const element = itineraryRef.current;

      const canvas = await toCanvas(element, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#FAFAFA',
        filter: (node) => {
          if (node instanceof HTMLElement && node.classList?.contains('no-print')) {
            return false;
          }
          return true;
        },
      });

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem('planify_onboarding');
    if (data) {
      const parsed = JSON.parse(data);
      setOnboardingData(parsed);

      // Check if itinerary is already cached
      const cachedItinerary = localStorage.getItem('planify_itinerary');
      if (cachedItinerary) {
        try {
          const parsedItinerary: ItineraryResponse = JSON.parse(cachedItinerary);
          if (parsedItinerary.concepts && parsedItinerary.concepts.length > 0) {
            setConcepts(parsedItinerary.concepts);
            return;
          }
        } catch (e) {
          // ignore parsing error and regenerate
        }
      }
      generateItinerary(parsed);
    }
  }, []);

  async function saveTrip(onboardingInfo: OnboardingData, itineraryInfo: ItineraryResponse) {
    if (!isSupabaseConfigured()) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('saved_trips').insert({
        user_id: user.id,
        departure: onboardingInfo.destination.from.city || onboardingInfo.destination.from.country,
        destination: onboardingInfo.destination.to.city || onboardingInfo.destination.to.country,
        start_date: onboardingInfo.dates.startDate,
        end_date: onboardingInfo.dates.endDate,
        itinerary_data: itineraryInfo,
        onboarding_data: onboardingInfo,
      });

      if (error) {
        console.error('⚠️ Failed to save trip to Supabase:', error.message);
      } else {
        console.log('✅ Trip saved to Supabase');
      }
    } catch (err) {
      console.error('⚠️ Error saving trip:', err);
    }
  }

  async function generateItinerary(data: OnboardingData) {
    setIsLoading(true);
    setError('');
    setConcepts([]);
    setSelectedConceptId(null);
    setParsedDays([]);
    setJourneyStops([]);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate itinerary');
      }

      const itineraryData: ItineraryResponse = await response.json();

      if (itineraryData.concepts && Array.isArray(itineraryData.concepts) && itineraryData.concepts.length > 0) {
        setConcepts(itineraryData.concepts);
        localStorage.setItem('planify_itinerary', JSON.stringify(itineraryData));
        await saveTrip(data, itineraryData);
      } else if (itineraryData.days && Array.isArray(itineraryData.days)) {
        // Fallback for single itinerary
        const fallbackConcept: ItineraryConcept = {
          id: 'iconic',
          title: 'The Iconic Highlights Expedition',
          tagline: 'Signature sights, celebrated landmarks, and essential culture.',
          theme: 'Classic & Must-See Heritage',
          badge: 'Most Popular',
          highlights: ['Signature Landmarks', 'Cultural Highlights', 'Historic Architecture'],
          estimated_daily_pace: 'Balanced (3-4 sights/day)',
          days: itineraryData.days,
          journey_stops: itineraryData.journey_stops,
        };
        setConcepts([fallbackConcept]);
        setSelectedConceptId('iconic');
        setParsedDays(itineraryData.days);
        if (itineraryData.journey_stops) {
          setJourneyStops(itineraryData.journey_stops);
        }
        localStorage.setItem('planify_itinerary', JSON.stringify(itineraryData));
        await saveTrip(data, itineraryData);
      } else {
        throw new Error('Invalid itinerary format received from AI engine');
      }
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSelectConcept = (conceptId: string) => {
    const target = concepts.find((c) => c.id === conceptId);
    if (target) {
      setSelectedConceptId(conceptId);
      setParsedDays(target.days || []);
      setJourneyStops(target.journey_stops || []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!onboardingData) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-blue-600 selection:text-white pb-20">
      {/* ── STICKY TOP NAVIGATION BAR ── */}
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.03] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>

            <Link href="/" className="hidden sm:flex items-center">
              <AtlasLogo size="sm" showSubtitle={false} />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {selectedConcept && (
              <button
                type="button"
                onClick={() => setSelectedConceptId(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3 Concepts</span>
              </button>
            )}

            <Link
              href="/saved-trips"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 text-xs font-black uppercase tracking-wider text-black hover:bg-black/5 transition"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved Trips</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto pt-8 px-4 sm:px-8">
        {isLoading && concepts.length === 0 && <GeneratingState />}

        {error && (
          <ErrorState message={error} onRetry={() => generateItinerary(onboardingData)} />
        )}

        {/* ── STAGE 1: CONCEPT SELECTION BOARD ── */}
        {!isLoading && !selectedConceptId && concepts.length > 0 && (
          <ConceptSelectionBoard
            concepts={concepts}
            onboardingData={onboardingData}
            onSelectConcept={handleSelectConcept}
          />
        )}

        {/* ── STAGE 2: FULL DETAILED EXPEDITION DOSSIER ── */}
        {!isLoading && selectedConcept && (
          <div ref={itineraryRef} className="space-y-8 animate-fadeIn">
            {/* Active Concept Switcher Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-blue-50/80 border border-blue-200/80 shadow-sm no-print">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {selectedConcept.badge}
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 block">
                    Active Travel Blueprint
                  </span>
                  <h4 className="text-base font-black uppercase tracking-tight text-black">
                    {selectedConcept.title}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedConceptId(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/15 bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition shadow-sm self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Switch Travel Concept</span>
              </button>
            </div>

            {/* Expedition Header */}
            <TripHeader
              data={onboardingData}
              onDownloadPdf={handleDownloadPdf}
              isPdfGenerating={isPdfGenerating}
            />

            {/* En-Route Sights & Waypoints */}
            {journeyStops.length > 0 && (
              <JourneyStopsCard stops={journeyStops} />
            )}

            {/* Day-by-Day Master Breakdown */}
            <div className="space-y-8">
              {parsedDays.map((day, index) => (
                <div key={day.day}>
                  <DayCard day={day} isStreaming={isLoading} />

                  {index === 0 && day.transport_bookings && day.transport_bookings.length > 0 && (
                    <TransportBookingsCard bookings={day.transport_bookings} />
                  )}

                  {index === 0 && day.hotels && day.hotels.length > 0 && (
                    <div className="mt-8 mb-8 rounded-3xl p-6 sm:p-8 border border-black/10 bg-white shadow-sm">
                      <div className="mb-6 border-b border-black/10 pb-4">
                        <h3 className="text-xl font-black uppercase text-black">
                          Recommended Stays & Accommodations
                        </h3>
                        <p className="text-xs font-bold text-black/50">
                          Curated hotels matching your tier and budget
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {day.hotels.map((hotel, idx) => (
                          <HotelCard key={idx} hotel={hotel} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="mt-12 mb-6 rounded-3xl p-6 border border-black/10 bg-white shadow-sm flex items-start gap-4">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-wider text-black mb-1">
                  Pricing & Availability Disclaimer
                </p>
                <p className="text-xs font-medium text-black/60 leading-relaxed">
                  All hotel rates, transit fares, and venue entry pricing are dynamic estimates generated via AI grounding. Actual real-time costs may fluctuate based on season, demand, and booking lead time. Please confirm on official operator portals prior to booking.
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading && parsedDays.length > 0 && (
          <StreamingIndicator currentDay={parsedDays.length + 1} />
        )}
      </div>
    </div>
  );
}
