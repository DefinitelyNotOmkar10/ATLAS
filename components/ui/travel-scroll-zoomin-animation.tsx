'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { ArrowUpRight, Compass, Globe } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Ultra-High-Resolution Vector Globe Aperture Path (ViewBox 0 0 1000 1000) ──────────
// Giant bounding rect (60,000px) with inner hollow spherical globe cutout (Radius 360 at center 500,500)
const HOLLOW_GLOBE_PATH = `
  M -20000 -20000 L 21000 -20000 L 21000 21000 L -20000 21000 Z
  M 500 140
  A 360 360 0 1 0 500 860
  A 360 360 0 1 0 500 140 Z
`.trim().replace(/\s+/g, ' ');

export interface TravelScrollZoominAnimationProps {
  title?: string;
  badge?: string;
  subtitle?: React.ReactNode;
  outroTitle?: React.ReactNode;
  outroSubtitle?: React.ReactNode;
  videoSrc?: string;
  posterSrc?: string;
  watermarkText?: string;
  className?: string;
}

export function TravelScrollZoominAnimation({
  badge = 'GLOBAL INTELLIGENCE & EXPLORATION',
  title = 'THE WORLD IN MOTION.',
  subtitle = (
    <>
      EXPERIENCE THE ESSENCE OF <span className="text-blue-600 font-black">AI-POWERED EXPLORATION</span> THROUGH REAL-TIME INTELLIGENCE. OUR{' '}
      <span className="text-blue-600 font-black">CINEMATIC</span> TRIP ENGINE TRANSFORMS YOUR AMBITIONS INTO A{' '}
      <span className="text-blue-600 font-black">PRECISION-ENGINEERED</span> ITINERARY. FROM ICONIC CONTINENTS TO HIDDEN ARCHIPELAGOS, WE DESIGN EVERY MINUTE TO{' '}
      <span className="text-blue-600 font-black">INSPIRE</span>.
    </>
  ),
  outroTitle = (
    <>
      EXPLORE <span className="text-blue-600 font-black">WITHOUT BOUNDARIES.</span>
    </>
  ),
  outroSubtitle = (
    <>
      FEEL THE FREEDOM OF EFFORTLESS TRAVEL THROUGH{' '}
      <span className="text-blue-600 font-black">DYNAMIC AI GROUNDING</span>, REAL-TIME BUDGET CALCULATION, AND{' '}
      <span className="text-blue-600 font-black">BESPOKE DAY PLANS</span>.
    </>
  ),
  videoSrc = 'https://res.cloudinary.com/dsuwzuaxp/video/upload/cinematic_drone_videos_shew9q.mp4',
  posterSrc = 'https://res.cloudinary.com/dsuwzuaxp/video/upload/cinematic_drone_videos_shew9q.jpg',
  watermarkText = 'ATLAS',
  className = '',
}: TravelScrollZoominAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scaleGroupRef = useRef<SVGGElement>(null);
  const globeAccentsRef = useRef<SVGGElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinRef.current || !scaleGroupRef.current) return;

    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    const ctx = gsap.context(() => {
      // Set initial scale on GPU
      gsap.set(scaleGroupRef.current, {
        scale: 1,
        transformOrigin: '500px 500px',
        force3D: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 0.5,
          pin: pinRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Prompt badge & coordinates fade out immediately on scroll
      if (badgeRef.current) {
        tl.to(
          badgeRef.current,
          {
            opacity: 0,
            y: -20,
            duration: 0.15,
            ease: 'power1.out',
          },
          0
        );
      }

      // 2. Corner registration brackets fade out smoothly
      if (cornersRef.current) {
        tl.to(
          cornersRef.current,
          {
            opacity: 0,
            duration: 0.2,
            ease: 'power1.out',
          },
          0.05
        );
      }

      // 3. Globe axis & latitude lines fade out quickly as zoom starts
      if (globeAccentsRef.current) {
        tl.to(
          globeAccentsRef.current,
          {
            opacity: 0,
            scale: 1.1,
            transformOrigin: '500px 500px',
            duration: 0.25,
            ease: 'power1.out',
          },
          0
        );
      }

      // 4. Massive GPU Vector Globe Zoom (from 1x to 85x!)
      // Explodes the circular globe window to over 40,000 pixels wide across the screen
      tl.to(
        scaleGroupRef.current,
        {
          scale: 85,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        0
      );

      // 5. Seamlessly fade overlay at the very end to guarantee 100% full-bleed video
      if (overlayRef.current) {
        tl.to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.15,
            ease: 'power1.in',
          },
          0.75
        );
      }

      // 6. Cinematic video depth parallax
      if (videoRef.current) {
        tl.to(
          videoRef.current,
          {
            scale: 1.15,
            duration: 1.0,
            ease: 'none',
          },
          0
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={`w-full bg-white text-black selection:bg-blue-600 selection:text-white ${className}`}>
      {/* 1. INTRO SECTION */}
      <section className="relative w-full min-h-[75vh] md:min-h-[85vh] bg-white flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 py-16 select-none border-b border-black/10">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center px-2 sm:px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/15 text-[11px] font-black uppercase tracking-[0.25em] text-black/70 mb-6 bg-black/[0.02]">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{badge}</span>
          </div>
          
          <h2 className="text-[11vw] sm:text-[8.5vw] md:text-[6.2rem] lg:text-[7.2rem] font-black uppercase leading-[0.88] tracking-[-0.04em] text-black mb-8 select-none">
            {title}
          </h2>
          
          <p className="max-w-3xl text-xs sm:text-sm md:text-base uppercase font-bold leading-relaxed tracking-wider text-black opacity-90">
            {subtitle}
          </p>

          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-xl"
            >
              <span>Build Your Itinerary</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. GRAND IMMERSIVE WORLD GLOBE VECTOR PORTAL DIVE */}
      <div
        ref={containerRef}
        className="relative w-full bg-white text-black selection:bg-blue-600 selection:text-white"
        style={{ height: '240vh' }}
      >
        <div
          ref={pinRef}
          className="motion-section__pin sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-white select-none relative"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {/* Base Layer: Fullscreen 4K/1080p Video */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              autoPlay
              preload="auto"
              poster={posterSrc}
            >
              <source src={videoSrc} type="video/mp4" />
              <source src="https://res.cloudinary.com/dsuwzuaxp/video/upload/856381-hd_1920_1080_30fps_gsq11b.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Bold, Large Hero Globe Aperture SVG Layer */}
          <div
            ref={overlayRef}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden"
            style={{ willChange: 'opacity' }}
          >
            <svg
              viewBox="0 0 1000 1000"
              className="w-full h-full min-w-full min-h-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ transform: 'translate3d(0, 0, 0)' }}
            >
              {/* Scalable Hollow Globe Cutout */}
              <g
                ref={scaleGroupRef}
                style={{
                  transformOrigin: '500px 500px',
                  willChange: 'transform',
                  transform: 'translate3d(0, 0, 0)',
                }}
              >
                <path
                  fillRule="evenodd"
                  fill="#ffffff"
                  d={HOLLOW_GLOBE_PATH}
                />
              </g>

              {/* Decorative Globe Axis Ring & Lat/Long Details (Fades out quickly on zoom) */}
              <g ref={globeAccentsRef} style={{ willChange: 'opacity, transform' }}>
                {/* Globe Outer Stand Ring */}
                <path
                  d="M 500 80 A 420 420 0 0 0 500 920"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.25"
                />
                {/* Globe Stand Base */}
                <path
                  d="M 500 920 L 500 970 M 420 970 L 580 970"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.3"
                />
                {/* Axis Top/Bottom Pins */}
                <line x1="500" y1="80" x2="500" y2="140" stroke="#000000" strokeWidth="6" opacity="0.3" />
                <line x1="500" y1="860" x2="500" y2="920" stroke="#000000" strokeWidth="6" opacity="0.3" />

                {/* Subtle Globe Grid Lines inside sphere */}
                <ellipse cx="500" cy="500" rx="360" ry="120" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
                <ellipse cx="500" cy="500" rx="140" ry="360" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
                <line x1="140" y1="500" x2="860" y2="500" stroke="#ffffff" strokeWidth="2" opacity="0.5" strokeDasharray="6 6" />
                <line x1="500" y1="140" x2="500" y2="860" stroke="#ffffff" strokeWidth="2" opacity="0.5" strokeDasharray="6 6" />
              </g>
            </svg>
          </div>

          {/* Foreground Coordinates, Badges, Registration Brackets */}
          <div ref={cornersRef} className="absolute inset-0 z-20 pointer-events-none">
            {/* Top-Left Corner */}
            <div className="absolute top-4 left-4 w-5 h-5 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 10 10" fill="none">
                <path d="M10 0V1H1V10H0V0H10Z" fill="currentColor" />
              </svg>
            </div>

            {/* Top-Right Corner */}
            <div className="absolute top-4 right-4 w-5 h-5 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 10 10" fill="none">
                <path d="M10 0V10H9V1H0V0H10Z" fill="currentColor" />
              </svg>
            </div>

            {/* Bottom-Left Corner */}
            <div className="absolute bottom-4 left-4 w-5 h-5 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 10 10" fill="none">
                <path d="M-4.37116e-07 0L1 -4.37114e-08L1 9L10 9L10 10L0 10L-4.37116e-07 0Z" fill="currentColor" />
              </svg>
            </div>

            {/* Bottom-Right Corner */}
            <div className="absolute bottom-4 right-4 w-5 h-5 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 10 10" fill="none">
                <path d="M10 10L-4.37114e-07 10L-3.93402e-07 9L9 9L9 -4.37114e-08L10 0L10 10Z" fill="currentColor" />
              </svg>
            </div>

            {/* Ambient Bold Background ATLAS Typography */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span className="text-[34vw] md:text-[38vw] lg:text-[42vw] font-black uppercase tracking-[-0.06em] leading-none text-black/10 select-none whitespace-nowrap">
                {watermarkText}
              </span>
            </div>
          </div>

          {/* Center Prompt Badge */}
          <div
            ref={badgeRef}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-black/50"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            <span>SCROLL TO DIVE INTO THE GLOBE</span>
          </div>
        </div>
      </div>

      {/* 3. OUTRO SECTION */}
      <footer className="relative z-10 w-full min-h-[70vh] md:min-h-[85vh] bg-white text-black flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 py-16 select-none border-t border-black/10">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center px-2 sm:px-4">
          <h3 className="text-[11vw] sm:text-[8.5vw] md:text-[6.2rem] lg:text-[7.2rem] font-black uppercase leading-[0.88] tracking-[-0.04em] text-black mb-8 select-none">
            {outroTitle}
          </h3>
          <p className="max-w-3xl text-xs sm:text-sm md:text-base uppercase font-bold leading-relaxed tracking-wider text-black opacity-90 mb-10">
            {outroSubtitle}
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-xl"
          >
            <span>Start Planning Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
            .motion-section__pin, button, p, span, h1, h2, h3 {
              font-family: 'Plus Jakarta Sans', sans-serif;
              font-style: normal !important;
            }
            .pin-spacer {
              background-color: #ffffff !important;
            }
          `,
        }}
      />
    </div>
  );
}

export default TravelScrollZoominAnimation;
