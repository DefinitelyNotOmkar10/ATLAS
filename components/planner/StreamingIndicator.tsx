import { onboardingStyles } from '@/lib/utils/onboardingStyles';

interface StreamingIndicatorProps {
  currentDay: number;
}

export default function StreamingIndicator({ currentDay }: StreamingIndicatorProps) {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg" style={onboardingStyles.card}>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-accent)', animationDelay: '0s' }}></div>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-secondary)', animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-accent)', animationDelay: '0.4s' }}></div>
        </div>
        <span className="font-medium" style={onboardingStyles.subheading}>
          Planning Day {currentDay}...
        </span>
      </div>
    </div>
  );
}


