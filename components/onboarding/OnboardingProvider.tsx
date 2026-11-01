"use client";

import { useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { OnboardingContext } from "@/lib/hooks/useOnboarding";
import {
  OnboardingStep,
  OnboardingData,
  ONBOARDING_STEPS_ORDER,
} from "@/lib/types/onboarding";

interface OnboardingProviderProps {
  children: ReactNode;
}

const INITIAL_DATA: OnboardingData = {
  name: "",
  travelers: {
    adults: 1,
    children: 0,
    travelStyle: null,
  },
  destination: {
    from: {
      country: "",
      state: "",
      city: "",
    },
    to: {
      country: "",
      state: "",
      city: "",
    },
    transport: "flight",
  },
  dates: {
    startDate: "",
    endDate: "",
    flexible: false,
  },
  preferences: {
    interests: [],
    pace: null,
    accommodation: null,
  },
  budget: {
    amount: 0,
    currency: "USD",
  },
};

const MOCK_PREFILL_DATA: OnboardingData = {
  name: "Vivek",
  travelers: {
    adults: 2,
    children: 0,
    travelStyle: "friends",
  },
  destination: {
    from: {
      country: "India",
      state: "Delhi",
      city: "Delhi",
    },
    to: {
      country: "USA",
      state: "California",
      city: "Los Angeles",
    },
    transport: "flight",
  },
  dates: {
    startDate: "2026-06-10",
    endDate: "2026-06-11",
    flexible: false,
  },
  preferences: {
    interests: ["Food & Dining", "Culture & Museums", "Nature & Outdoors"],
    pace: "moderate",
    accommodation: "mid-range",
  },
  budget: {
    amount: 150000,
    currency: "INR",
  },
};

function isMockPrefillEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_USE_MOCK_ITINERARY;
  return flag === "true" || flag === "1";
}

function getInitialData(): OnboardingData {
  return isMockPrefillEnabled() ? MOCK_PREFILL_DATA : INITIAL_DATA;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.NAME);
  const [data, setData] = useState<OnboardingData>(getInitialData);

  const updateData = useCallback((field: keyof OnboardingData, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = ONBOARDING_STEPS_ORDER.indexOf(currentStep);
    if (currentIndex < ONBOARDING_STEPS_ORDER.length - 1) {
      setCurrentStep(ONBOARDING_STEPS_ORDER[currentIndex + 1]);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    const currentIndex = ONBOARDING_STEPS_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(ONBOARDING_STEPS_ORDER[currentIndex - 1]);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: OnboardingStep) => {
    setCurrentStep(step);
  }, []);

  const isStepValid = useCallback(
    (step: OnboardingStep): boolean => {
      switch (step) {
        case OnboardingStep.NAME:
          return data.name.trim().length > 0;
        case OnboardingStep.TRAVELERS:
          return data.travelers.adults > 0 && data.travelers.travelStyle !== null;
        case OnboardingStep.DESTINATIONS:
          return data.destination.from.city.trim() !== "" && 
                 data.destination.to.city.trim() !== "";
        case OnboardingStep.DATES:
          return data.dates.startDate !== "" && data.dates.endDate !== "";
        case OnboardingStep.PREFERENCES:
          return data.preferences.interests.length > 0 && 
                 data.preferences.pace !== null &&
                 data.preferences.accommodation !== null;
        case OnboardingStep.BUDGET:
          return data.budget.amount > 0;
        case OnboardingStep.SUMMARY:
          return true;
        default:
          return false;
      }
    },
    [data]
  );

  const completeOnboarding = useCallback(() => {
    localStorage.setItem("planify_onboarding", JSON.stringify(data));
    localStorage.setItem("planify_onboarding_completed", "true");
    router.push("/planner");
  }, [data, router]);

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        data,
        updateData,
        nextStep,
        previousStep,
        goToStep,
        completeOnboarding,
        isStepValid,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}


