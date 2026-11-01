"use client";

import { useState, useEffect } from "react";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { BudgetData } from "@/lib/types/onboarding";
import { ArrowLeft, ArrowRight, Sparkles, Coins, Info } from "lucide-react";

const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
];

export default function OnboardingBudget() {
  const { data, updateData, nextStep, previousStep } = useOnboarding();
  const [budget, setBudget] = useState<BudgetData>(data.budget);
  const [error, setError] = useState("");

  useEffect(() => {
    setBudget(data.budget);
  }, [data.budget]);

  const handleNext = () => {
    if (budget.amount <= 0) {
      setError("Please enter a valid budget amount!");
      return;
    }
    updateData("budget", budget);
    setError("");
    nextStep();
  };

  const updateBudget = (field: keyof BudgetData, value: number | string | boolean) => {
    setBudget((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const selectedCurrency = CURRENCIES.find((c) => c.code === budget.currency) || CURRENCIES[0];

  return (
    <div className="planify-onboarding-step animate-fadeIn space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 bg-blue-50/50">
          <Sparkles className="w-3 h-3" />
          <span>Step 06 / Allocation</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] text-black">
          WHAT&apos;S YOUR <br />
          <span className="text-blue-600">TOTAL BUDGET?</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black/60">
          Set your total target spending for the entire trip.
        </p>
      </div>

      <div className="space-y-6 max-w-xl">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm space-y-5">
          {/* Currency Selection */}
          <div>
            <label htmlFor="currency-select" className="block text-[11px] font-black uppercase tracking-widest text-black/60 mb-2">
              Currency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CURRENCIES.map((currency) => {
                const isSelected = budget.currency === currency.code;
                return (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => updateBudget("currency", currency.code)}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 text-blue-600 font-black ring-2 ring-blue-600/20"
                        : "border-black/10 bg-white text-black font-bold hover:border-black/30"
                    }`}
                  >
                    <span className="text-base mr-1">{currency.symbol}</span>
                    <span className="text-xs uppercase">{currency.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount-input" className="block text-[11px] font-black uppercase tracking-widest text-black/60 mb-2">
              Target Total Spend
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-black/40">
                {selectedCurrency.symbol}
              </span>
              <input
                id="amount-input"
                type="number"
                value={budget.amount || ""}
                onChange={(e) => updateBudget("amount", parseFloat(e.target.value) || 0)}
                placeholder="50,000"
                min="0"
                step="1000"
                className="w-full pl-14 pr-5 py-4 text-2xl font-black bg-white border border-black/15 rounded-2xl text-black placeholder:text-black/20 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                aria-describedby={error ? "budget-error" : undefined}
                autoFocus
              />
            </div>
          </div>

          {budget.amount > 0 && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/60 flex items-start gap-3">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-black/70 leading-relaxed">
                Our Gemini AI engine will distribute this amount across stays, transit, meals, and activities with exact breakdown numbers.
              </p>
            </div>
          )}
        </div>

        {error && (
          <p id="budget-error" className="text-xs font-bold text-red-500 animate-fadeIn" role="alert">
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
            disabled={budget.amount <= 0}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-lg"
          >
            <span>Review Itinerary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
