export enum OnboardingStep {
  NAME = "name",
  TRAVELERS = "travelers",
  DESTINATIONS = "destinations",
  DATES = "dates",
  PREFERENCES = "preferences",
  BUDGET = "budget",
  SUMMARY = "summary",
}

export interface OnboardingData {
  name: string;
  travelers: TravelersData;
  destination: DestinationData;
  dates: DatesData;
  preferences: PreferencesData;
  budget: BudgetData;
}

export interface LocationDetail {
  country: string;
  state: string;
  city: string;
}

export interface DestinationData {
  from: LocationDetail;
  to: LocationDetail;
  transport: "flight" | "car" | "train" | "bus" | "cruise" | "other" | null;
}

export interface TravelersData {
  adults: number;
  children: number;
  travelStyle: "solo" | "couple" | "family" | "friends" | "business" | null;
}

export interface DatesData {
  startDate: string;
  endDate: string;
  flexible: boolean;
}

export interface PreferencesData {
  interests: string[];
  pace: "relaxed" | "moderate" | "packed" | null;
  accommodation: "budget" | "mid-range" | "luxury" | null;
}

export interface BudgetData {
  amount: number;
  currency: string;
  includesFlights?: boolean;
}

export interface OnboardingContextType {
  currentStep: OnboardingStep;
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  isStepValid: (step: OnboardingStep) => boolean;
}

export interface StepComponentProps {
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const ONBOARDING_STEPS_ORDER: OnboardingStep[] = [
  OnboardingStep.NAME,
  OnboardingStep.TRAVELERS,
  OnboardingStep.DESTINATIONS,
  OnboardingStep.DATES,
  OnboardingStep.PREFERENCES,
  OnboardingStep.BUDGET,
  OnboardingStep.SUMMARY,
];

export const INTEREST_OPTIONS = [
  "Culture & Museums",
  "Food & Dining",
  "Nature & Outdoors",
  "Adventure Sports",
  "Shopping",
  "Nightlife",
  "History",
  "Beach & Relaxation",
  "Photography",
  "Local Experiences",
];


