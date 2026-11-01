"use client";

import { useState, useEffect } from "react";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { TravelersData } from "@/lib/types/onboarding";
import { ArrowLeft, ArrowRight, Sparkles, User, Users, Heart, Briefcase, Plus, Minus } from "lucide-react";

const TRAVEL_STYLES = [
  { value: "solo", label: "Solo Explorer", icon: User, desc: "Personal freedom & flexible pace" },
  { value: "couple", label: "Couple / Romantic", icon: Heart, desc: "Boutique dining & scenic views" },
  { value: "family", label: "Family Crew", icon: Users, desc: "Comfort, kids activities & safety" },
  { value: "friends", label: "Friends Group", icon: Users, desc: "Nightlife, adventure & shared spots" },
  { value: "business", label: "Business Travel", icon: Briefcase, desc: "Efficient stays & transit links" },
] as const;

export default function OnboardingTravelers() {
  const { data, updateData, nextStep, previousStep } = useOnboarding();
  const [travelers, setTravelers] = useState<TravelersData>(data.travelers);
  const [error, setError] = useState("");

  useEffect(() => {
    setTravelers(data.travelers);
  }, [data.travelers]);

  const handleNext = () => {
    if (travelers.adults < 1) {
      setError("Please select at least one adult traveler!");
      return;
    }
    if (travelers.travelStyle === null) {
      setError("Please select your travel style!");
      return;
    }
    updateData("travelers", travelers);
    setError("");
    nextStep();
  };

  const updateTravelers = (field: keyof TravelersData, value: number | string) => {
    setTravelers((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  return (
    <div className="planify-onboarding-step animate-fadeIn space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 bg-blue-50/50">
          <Sparkles className="w-3 h-3" />
          <span>Step 02 / Party</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] text-black">
          WHO&apos;S COMING <br />
          <span className="text-blue-600">ON THIS TRIP?</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black/60">
          Tell us about group size and travel vibe.
        </p>
      </div>

      <div className="space-y-6 max-w-xl">
        {/* Headcount Card */}
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm space-y-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-black/60 block">
            Traveler Headcount
          </span>

          <div className="grid grid-cols-2 gap-4">
            {/* Adults */}
            <div className="p-4 rounded-2xl border border-black/10 bg-black/[0.02] flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-black">Adults</p>
                <p className="text-[10px] font-bold text-black/40">Age 18+</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateTravelers("adults", Math.max(1, travelers.adults - 1))}
                  className="h-8 w-8 rounded-full border border-black/20 bg-white flex items-center justify-center text-black transition hover:bg-black hover:text-white"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center font-black text-sm text-black">
                  {travelers.adults}
                </span>
                <button
                  type="button"
                  onClick={() => updateTravelers("adults", travelers.adults + 1)}
                  className="h-8 w-8 rounded-full border border-black/20 bg-white flex items-center justify-center text-black transition hover:bg-black hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="p-4 rounded-2xl border border-black/10 bg-black/[0.02] flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-black">Children</p>
                <p className="text-[10px] font-bold text-black/40">Age 0–17</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateTravelers("children", Math.max(0, travelers.children - 1))}
                  className="h-8 w-8 rounded-full border border-black/20 bg-white flex items-center justify-center text-black transition hover:bg-black hover:text-white"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center font-black text-sm text-black">
                  {travelers.children}
                </span>
                <button
                  type="button"
                  onClick={() => updateTravelers("children", travelers.children + 1)}
                  className="h-8 w-8 rounded-full border border-black/20 bg-white flex items-center justify-center text-black transition hover:bg-black hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Style Selector */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-black/60 block">
            Select Travel Style
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRAVEL_STYLES.map((style) => {
              const Icon = style.icon;
              const isSelected = travelers.travelStyle === style.value;
              return (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => updateTravelers("travelStyle", style.value)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20"
                      : "border-black/10 bg-white hover:border-black/30"
                  }`}
                >
                  <div
                    className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-blue-600 text-white" : "bg-black/5 text-black"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-black">{style.label}</p>
                    <p className="text-[10px] font-bold text-black/50 mt-0.5">{style.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-xs font-bold text-red-500 animate-fadeIn" role="alert">
            {error}
          </p>
        )}

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
            onClick={handleNext}
            disabled={travelers.adults < 1 || travelers.travelStyle === null}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-lg"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
