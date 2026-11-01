"use client";

import { useState, useEffect } from "react";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingName() {
  const { data, updateData, nextStep } = useOnboarding();
  const [name, setName] = useState(data.name);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(data.name);
  }, [data.name]);

  const handleNext = () => {
    if (name.trim().length === 0) {
      setError("Please enter your name!");
      return;
    }
    updateData("name", name.trim());
    setError("");
    nextStep();
  };

  const handleChange = (value: string) => {
    setName(value);
    setError("");
  };

  return (
    <div className="planify-onboarding-step animate-fadeIn flex items-center min-h-[500px]">
      <div className="w-full max-w-lg space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 bg-blue-50/50">
            <Sparkles className="w-3 h-3" />
            <span>Step 01 / Identity</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] text-black">
            WELCOME. <br />
            <span className="text-blue-600">WHO&apos;S TRAVELING?</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black/60">
            Let&apos;s start crafting your personalized itinerary.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name-input" className="block text-xs font-black uppercase tracking-widest text-black/70 mb-2">
              Your Full Name
            </label>

            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              placeholder="e.g. Alex Morgan"
              className={`w-full px-5 py-4 text-base font-bold bg-white border ${error ? "border-red-500" : "border-black/15"} rounded-2xl text-black placeholder:text-black/30 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all shadow-sm`}
              aria-invalid={!!error}
              aria-describedby={error ? "name-error" : undefined}
              autoFocus
            />

            {error && (
              <p id="name-error" className="mt-2 text-xs font-bold text-red-500" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!name.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-lg"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
