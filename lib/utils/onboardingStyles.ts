export const onboardingStyles = {
  primaryButton: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    padding: '14px 32px',
    borderRadius: '9999px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '800',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    color: '#000000',
    padding: '14px 32px',
    borderRadius: '9999px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    fontWeight: '800',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  input: {
    borderColor: '#E5E7EB',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: '600',
  },
  inputFocus: {
    borderColor: '#2563EB',
    outline: 'none',
  },
  inputError: {
    borderColor: '#EF4444',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: '24px',
  },
  cardSelected: {
    borderColor: '#2563EB',
    backgroundColor: 'rgba(37, 99, 235, 0.04)',
  },

  heading: {
    color: '#000000',
    fontWeight: '900',
    letterSpacing: '-0.03em',
    textTransform: 'uppercase' as const,
  },
  subheading: {
    color: '#4B5563',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  error: {
    color: '#EF4444',
  },

  background: {
    backgroundColor: '#FAFAFA',
  },

  badge: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderColor: 'rgba(37, 99, 235, 0.25)',
    color: '#2563EB',
    fontWeight: '800',
    textTransform: 'uppercase' as const,
  },
} as const;
