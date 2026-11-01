import { OnboardingData } from '@/lib/types/onboarding';
import { Download, Loader2, MapPin, Calendar, Wallet, Users, Sparkles } from 'lucide-react';
import { getDestinationHeroImage } from '@/lib/utils/destinationImages';

interface TripHeaderProps {
  data: OnboardingData;
  onDownloadPdf?: () => void;
  isPdfGenerating?: boolean;
}

export default function TripHeader({ data, onDownloadPdf, isPdfGenerating }: TripHeaderProps) {
  const getCurrency = () => {
    const currencies: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
    };
    return currencies[data.budget.currency] || '₹';
  };

  const getTripDuration = () => {
    if (!data.dates.startDate || !data.dates.endDate) return 1;
    const start = new Date(data.dates.startDate);
    const end = new Date(data.dates.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const fromCity = data.destination.from.city;
  const toCity = data.destination.to.city;
  const heroImage = getDestinationHeroImage(toCity);

  return (
    <div className="mb-8 p-8 sm:p-12 rounded-3xl border border-black/10 text-white shadow-2xl relative overflow-hidden bg-black">
      {/* Real-World High-Resolution Destination Background Photography */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 filter brightness-[0.45] contrast-110"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Editorial Luxury Gradient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 mb-4 shadow-lg">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>AI-GROUNDED ITINERARY DOSSIER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.92] tracking-tight text-white mb-6 drop-shadow-md">
            {toCity} <span className="text-blue-500">EXPEDITION.</span>
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-wider text-white/90">
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {fromCity} → {toCity}
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {getTripDuration()} Days
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Wallet className="w-3.5 h-3.5 text-blue-400" />
              {getCurrency()}{data.budget.amount.toLocaleString()} Target
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              {data.travelers.adults + data.travelers.children} Travelers
            </span>
          </div>
        </div>

        {onDownloadPdf && (
          <div className="no-print shrink-0">
            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={isPdfGenerating}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 disabled:opacity-50 shadow-2xl"
            >
              {isPdfGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
