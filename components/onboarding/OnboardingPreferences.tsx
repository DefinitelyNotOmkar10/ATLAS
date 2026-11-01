"use client";

import { useState, useEffect } from "react";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { PreferencesData, INTEREST_OPTIONS } from "@/lib/types/onboarding";
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Flame, 
  Scale, 
  Rocket, 
  Tent, 
  Building2, 
  Crown 
} from "lucide-react";

const PACE_OPTIONS = [
  { value: "relaxed", label: "Relaxed", description: "Unrushed mornings & scenic downtime", icon: Scale },
  { value: "moderate", label: "Balanced", description: "Healthy mix of sights & rest", icon: Flame },
  { value: "packed", label: "Full Throttle", description: "Maximize every single hour", icon: Rocket },
] as const;

const ACCOMMODATION_OPTIONS = [
  { value: "budget", label: "Budget Stays", description: "Clean hostels & budget inns", icon: Tent },
  { value: "mid-range", label: "Mid-Range", description: "Comfortable boutique & 3-4★ hotels", icon: Building2 },
  { value: "luxury", label: "Luxury Tier", description: "5★ resorts & luxury penthouses", icon: Crown },
] as const;

export default function OnboardingPreferences() {
  const { data, updateData, nextStep, previousStep } = useOnboarding();
  const [preferences, setPreferences] = useState<PreferencesData>(data.preferences);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreferences(data.preferences);
  }, [data.preferences]);

  const handleNext = () => {
    if (preferences.interests.length === 0) {
      setError("Please select at least one interest!");
      return;
    }
    if (preferences.pace === null) {
      setError("Please select your preferred pace!");
      return;
    }
    if (preferences.accommodation === null) {
      setError("Please select accommodation tier!");
      return;
    }
    updateData("preferences", preferences);
    setError("");
    nextStep();
  };

  const toggleInterest = (interest: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
    setError("");
  };

  const updatePreference = (field: keyof PreferencesData, value: string) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  return (
    <div className="planify-onboarding-step animate-fadeIn space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 bg-blue-50/50">
          <Sparkles className="w-3 h-3" />
          <span>Step 05 / Vibe & Pace</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] text-black">
          CUSTOMIZE YOUR <br />
          <span className="text-blue-600">TRAVEL VIBE.</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black/60">
          Pick your passions, daily rhythm, and hotel comfort level.
        </p>
      </div>

      <div className="space-y-6 max-w-xl">
        {/* 1. Interests */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-black/60 block">
            What are your interests? (Select multiple)
          </span>

          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = preferences.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-black text-white shadow-sm ring-2 ring-black/20"
                      : "bg-white border border-black/15 text-black/70 hover:border-black hover:text-black"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-blue-400" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Travel Pace */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-black/60 block">
            Daily Travel Rhythm & Pace
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PACE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = preferences.pace === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePreference("pace", option.value)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20"
                      : "border-black/10 bg-white hover:border-black/30"
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-2 ${isSelected ? "text-blue-600" : "text-black/60"}`} />
                  <div>
                    <p className="text-xs font-black uppercase text-black">{option.label}</p>
                    <p className="text-[10px] font-bold text-black/50 mt-0.5">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Accommodation Tier */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-black/60 block">
            Accommodation Tier
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ACCOMMODATION_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = preferences.accommodation === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePreference("accommodation", option.value)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20"
                      : "border-black/10 bg-white hover:border-black/30"
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-2 ${isSelected ? "text-blue-600" : "text-black/60"}`} />
                  <div>
                    <p className="text-xs font-black uppercase text-black">{option.label}</p>
                    <p className="text-[10px] font-bold text-black/50 mt-0.5">{option.description}</p>
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
            disabled={preferences.interests.length === 0 || preferences.pace === null || preferences.accommodation === null}
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
