import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export default function HowItWorksSection() {
  return (
    <section 
      className="planify-how-it-works py-16 sm:py-24"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            How It Works
          </h2>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ color: 'var(--color-text-light)' }}
          >
            From inspiration to itinerary in just four simple steps
          </p>
        </div>

        <div className="relative">
          <div 
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 transform -translate-y-1/2 z-0"
            style={{ background: 'linear-gradient(to right, var(--color-accent) 0%, var(--color-secondary) 100%)' }}
          ></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div
                key={step.id}
                className="planify-step flex flex-col items-center text-center"
              >
                <div 
                  className="planify-step-number w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%)',
                    color: 'var(--color-surface)'
                  }}
                >
                  {step.step}
                </div>

                <div 
                  className="planify-step-illustration w-full h-48 rounded-2xl mb-6 flex items-center justify-center border-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-background-dark) 100%)',
                    borderColor: 'var(--color-background-dark)'
                  }}
                >
                  <span 
                    className="font-medium"
                    style={{ color: 'var(--color-text-light)', opacity: 0.6 }}
                  >
                    Step {step.step} Illustration
                  </span>
                </div>

                <h3 
                  className="text-xl font-bold mb-3"
                  style={{ color: 'var(--color-text)' }}
                >
                  {step.title}
                </h3>

                <p 
                  className="leading-relaxed"
                  style={{ color: 'var(--color-text-light)' }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <a
            href="/onboarding"
            className="inline-block px-8 py-4 font-bold text-lg rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%)',
              color: 'var(--color-surface)'
            }}
          >
            Start Planning Now
          </a>
        </div>
      </div>
    </section>
  );
}


