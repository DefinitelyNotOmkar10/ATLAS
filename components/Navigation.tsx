import Link from "next/link";
import { PRODUCT_NAME, NAV_LINKS } from "@/lib/constants";

export default function Navigation() {
  return (
    <nav
      className="atlas-nav fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'var(--color-background-dark)'
      }}
      role="navigation"
      aria-label="Atlas home"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="atlas-logo flex items-center space-x-2"
            aria-label="Atlas home"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%)' }}
            >
              <span className="font-bold text-lg" style={{ color: 'var(--color-surface)' }}>A</span>
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{PRODUCT_NAME}</span>
          </Link>

          <div className="flex items-center space-x-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="atlas-nav-link px-6 py-2 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%)',
                  color: 'var(--color-surface)'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
