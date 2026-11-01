"use client";

import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { ArrowLeft, ArrowRight, Sparkles, MapPin, Calendar, Users, Wallet, CheckCircle2 } from "lucide-react";

export default function OnboardingSummary() {
  const { data, previousStep, completeOnboarding } = useOnboarding();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getTripDuration = () => {
    if (!data.dates.startDate || !data.dates.endDate) return 1;
    const start = new Date(data.dates.startDate);
    const end = new Date(data.dates.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCurrencySymbol = () => {
    const currencies: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return currencies[data.budget.currency] || "₹";
  };

  return (
    <div className="planify-onboarding-step animate-fadeIn space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 bg-blue-50/50">
          <Sparkles className="w-3 h-3" />
          <span>Step 07 / Final Review</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] text-black">
          READY TO PLAN, <br />
          <span className="text-blue-600">{data.name.toUpperCase()}?</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black/60">
          Confirm your parameters before triggering our AI generation engine.
        </p>
      </div>

      <div className="space-y-4 max-w-xl">
        {/* Main Route Card */}
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40 block">
                Itinerary Scope
              </span>
              <h3 className="text-xl font-black uppercase text-black">
                {data.destination.to.city || "Custom Trip"} Expedition
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider">
              {getTripDuration()} Days
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Route */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/50 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-blue-600" /> Route & Transit
              </span>
              <p className="text-xs font-black uppercase text-black">
                {data.destination.from.city} → {data.destination.to.city}
              </p>
              <p className="text-[10px] font-bold text-black/60 capitalize">
                Via {data.destination.transport}
              </p>
            </div>

            {/* Dates */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/50 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-blue-600" /> Schedule
              </span>
              <p className="text-xs font-black uppercase text-black">
                {formatDate(data.dates.startDate)} – {formatDate(data.dates.endDate)}
              </p>
              {data.dates.flexible && (
                <p className="text-[10px] font-bold text-blue-600">Flexible dates</p>
              )}
            </div>

            {/* Party */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/50 flex items-center gap-1">
                <Users className="h-3 w-3 text-blue-600" /> Travelers
              </span>
              <p className="text-xs font-black uppercase text-black">
                {data.travelers.adults} {data.travelers.adults === 1 ? "Adult" : "Adults"}
                {data.travelers.children > 0 && `, ${data.travelers.children} Kids`}
              </p>
              <p className="text-[10px] font-bold text-black/60 capitalize">
                {data.travelers.travelStyle}
              </p>
            </div>

            {/* Budget */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/50 flex items-center gap-1">
                <Wallet className="h-3 w-3 text-blue-600" /> Target Budget
              </span>
              <p className="text-sm font-black uppercase text-black">
                {getCurrencySymbol()}{data.budget.amount.toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-black/60">
                {data.preferences.accommodation} stay • {data.preferences.pace} pace
              </p>
            </div>
          </div>

          {/* Interests Pills */}
          {data.preferences.interests.length > 0 && (
            <div className="border-t border-black/10 pt-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40 block mb-2">
                Themes & Interests
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.preferences.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 rounded-full bg-black/[0.04] text-[10px] font-black uppercase text-black/80"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={previousStep}
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-full border border-black/15 bg-white text-black font-black text-xs uppercase tracking-wider transition hover:bg-black/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={completeOnboarding}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-xl"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Itinerary Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
