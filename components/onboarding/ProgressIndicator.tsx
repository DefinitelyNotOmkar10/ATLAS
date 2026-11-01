import { OnboardingStep, ONBOARDING_STEPS_ORDER } from "@/lib/types/onboarding";

interface ProgressIndicatorProps {
  currentStep: OnboardingStep;
}

const STEP_LABELS: Record<OnboardingStep, string> = {
  [OnboardingStep.NAME]: "Identity",
  [OnboardingStep.TRAVELERS]: "Travelers",
  [OnboardingStep.DESTINATIONS]: "Route & Mode",
  [OnboardingStep.DATES]: "Trip Schedule",
  [OnboardingStep.PREFERENCES]: "Vibe & Pace",
  [OnboardingStep.BUDGET]: "Budget Allocation",
  [OnboardingStep.SUMMARY]: "Final Review",
};

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentIndex = ONBOARDING_STEPS_ORDER.indexOf(currentStep);
  const totalSteps = ONBOARDING_STEPS_ORDER.length;
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
      <div className="flex justify-between items-center mb-1.5 text-[11px] font-black uppercase tracking-wider">
        <span className="text-black flex items-center gap-1.5">
          <span className="text-blue-600">PHASE 0{currentIndex + 1}</span>
          <span className="text-black/30">•</span>
          <span>{STEP_LABELS[currentStep]}</span>
        </span>
        <span className="text-black/40 font-mono text-[10px]">
          {currentIndex + 1}/{totalSteps}
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
