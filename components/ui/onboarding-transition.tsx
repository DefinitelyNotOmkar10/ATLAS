'use client';

interface OnboardingTransitionProps {
  children: React.ReactNode;
  stepKey: string | number;
  direction?: 'forward' | 'backward';
}

const OnboardingTransition: React.FC<OnboardingTransitionProps> = ({
  children,
}) => {
  return (
    <div className="w-full" style={{ overflow: 'visible' }}>
      {children}
    </div>
  );
};

export default OnboardingTransition;

