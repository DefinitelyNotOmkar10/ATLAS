import { createContext, useContext } from "react";
import { OnboardingContextType } from "@/lib/types/onboarding";

export const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}


