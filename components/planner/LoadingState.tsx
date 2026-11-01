import { onboardingStyles } from '@/lib/utils/onboardingStyles';

export default function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mb-4" style={{ borderColor: 'var(--color-secondary)', borderTopColor: 'transparent' }}></div>
        <p className="text-xl font-medium" style={onboardingStyles.heading}>
          Loading your trip details...
        </p>
      </div>
    </div>
  );
}


