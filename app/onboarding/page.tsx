"use client";

import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { OnboardingStep } from "@/lib/types/onboarding";
import ProgressIndicator from "@/components/onboarding/ProgressIndicator";
import OnboardingName from "@/components/onboarding/OnboardingName";
import OnboardingTravelers from "@/components/onboarding/OnboardingTravelers";
import OnboardingDestinations from "@/components/onboarding/OnboardingDestinations";
import OnboardingDates from "@/components/onboarding/OnboardingDates";
import OnboardingPreferences from "@/components/onboarding/OnboardingPreferences";
import OnboardingBudget from "@/components/onboarding/OnboardingBudget";
import OnboardingSummary from "@/components/onboarding/OnboardingSummary";
import OnboardingTransition from "@/components/ui/onboarding-transition";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AtlasLogo } from "@/components/ui/AtlasLogo";
import { ArrowLeft } from "lucide-react";

const STEP_IMAGES: Record<OnboardingStep, { url: string; title: string; subtitle: string; location: string }> = {
  [OnboardingStep.NAME]: {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85",
    title: "THE JOURNEY BEGINS",
    subtitle: "AI-POWERED EXPLORATION & IDENTITY",
    location: "Dolomites, Italian Alps",
  },
  [OnboardingStep.TRAVELERS]: {
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=85",
    title: "PARTY DYNAMICS",
    subtitle: "BESPOKE PACING & GROUP HARMONY",
    location: "Amalfi Coast, Italy",
  },
  [OnboardingStep.DESTINATIONS]: {
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
    title: "ROUTE ARCHITECTURE",
    subtitle: "MULTI-MODAL INTELLIGENCE & TRANSIT",
    location: "Kyoto, Japan",
  },
  [OnboardingStep.DATES]: {
    url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85",
    title: "SEASONAL TIMING",
    subtitle: "WEATHER OPTIMIZATION & DAY FLOW",
    location: "Santorini, Greece",
  },
  [OnboardingStep.PREFERENCES]: {
    url: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1600&q=85",
    title: "CURATED EXPERIENCES",
    subtitle: "HIDDEN GEMS & CULINARY EXCELLENCE",
    location: "Marrakech, Morocco",
  },
  [OnboardingStep.BUDGET]: {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    title: "BUDGET ALLOCATION",
    subtitle: "PRECISION PRICING & TIER MATCHING",
    location: "Swiss Alps & Riviera",
  },
  [OnboardingStep.SUMMARY]: {
    url: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1600&q=85",
    title: "EXPEDITION READY",
    subtitle: "SYNTHESIZING COMPLETE DOSSIER",
    location: "Bora Bora, French Polynesia",
  },
};

function OnboardingContent() {
  const { currentStep } = useOnboarding();
  const prevStepRef = useRef(currentStep);

  const getDirection = () => {
    const stepOrder = [
      OnboardingStep.NAME,
      OnboardingStep.TRAVELERS,
      OnboardingStep.DESTINATIONS,
      OnboardingStep.DATES,
      OnboardingStep.PREFERENCES,
      OnboardingStep.BUDGET,
      OnboardingStep.SUMMARY,
    ];

    const currentIndex = stepOrder.indexOf(currentStep);
    const prevIndex = stepOrder.indexOf(prevStepRef.current);

    prevStepRef.current = currentStep;

    return currentIndex > prevIndex ? "forward" : "backward";
  };

  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.NAME:
        return <OnboardingName />;
      case OnboardingStep.TRAVELERS:
        return <OnboardingTravelers />;
      case OnboardingStep.DESTINATIONS:
        return <OnboardingDestinations />;
      case OnboardingStep.DATES:
        return <OnboardingDates />;
      case OnboardingStep.PREFERENCES:
        return <OnboardingPreferences />;
      case OnboardingStep.BUDGET:
        return <OnboardingBudget />;
      case OnboardingStep.SUMMARY:
        return <OnboardingSummary />;
      default:
        return <OnboardingName />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-blue-600 selection:text-white">
      {/* ── STICKY TOP HEADER WITH PROMINENT BACK TO HOME BUTTON & PROGRESS ── */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Logo & Back to Home */}
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

          {/* Progress Indicator */}
          <div className="flex-1 max-w-md ml-4 sm:ml-8">
            <ProgressIndicator currentStep={currentStep} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Form Step Area */}
          <div className="min-h-[580px] py-4" style={{ overflow: "visible" }}>
            <OnboardingTransition stepKey={currentStep} direction={getDirection()}>
              {renderStep()}
            </OnboardingTransition>
          </div>

          {/* Right Editorial Visual Panel */}
          <div className="hidden lg:block relative h-[650px] w-full rounded-3xl overflow-hidden border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-black/5">
            <div key={currentStep} className="animate-fadeIn relative w-full h-full">
              <Image
                src={STEP_IMAGES[currentStep].url}
                alt={STEP_IMAGES[currentStep].title}
                fill
                unoptimized
                sizes="(max-width: 1200px) 50vw, 600px"
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              {/* Top Location Pill Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  {STEP_IMAGES[currentStep].location}
                </span>
              </div>

              {/* Bottom Editorial Caption */}
              <div className="absolute bottom-8 left-8 right-8 text-white pointer-events-none">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 block mb-1.5">
                  {STEP_IMAGES[currentStep].subtitle}
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">
                  {STEP_IMAGES[currentStep].title}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}
