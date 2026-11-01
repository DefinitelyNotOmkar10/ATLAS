import { onboardingStyles } from '@/lib/utils/onboardingStyles';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-2xl font-bold mb-3" style={onboardingStyles.heading}>
          Oops! Something went wrong
        </h3>
        <p className="text-lg mb-6" style={onboardingStyles.error}>
          {message}
        </p>
        <button
          onClick={onRetry}
          className="px-8 py-4 font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          style={onboardingStyles.primaryButton}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}


