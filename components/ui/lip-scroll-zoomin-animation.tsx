'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HOLLOW_GLOBE_PATH = `
  M -20000 -20000 L 21000 -20000 L 21000 21000 L -20000 21000 Z
  M 500 140
  A 360 360 0 1 0 500 860
  A 360 360 0 1 0 500 140 Z
`.trim().replace(/\s+/g, ' ');

export interface LipScrollZoominAnimationProps {
  title?: string;
  subtitle?: React.ReactNode;
  outroTitle?: React.ReactNode;
  outroSubtitle?: React.ReactNode;
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
}

export function LipScrollZoominAnimation({
  title = 'A VISION IN MOTION.',
  subtitle = (
    <>
      EXPERIENCE THE ESSENCE OF <span className="text-blue-600 font-black">GLOBAL ADVENTURE</span> THROUGH FILM. OUR{' '}
      <span className="text-blue-600 font-black">CINEMATIC</span> JOURNEY BRINGS TO LIFE THE BOLD, ARTISTIC SPIRIT
      BEHIND EACH DESTINATION. <span className="text-blue-600 font-black">WATCH</span> AS OUR DESIGNS MOVE,{' '}
      <span className="text-blue-600 font-black">INSPIRE</span>, AND TELL STORIES OF EXPLORATION, WONDER, AND FREEDOM.
    </>
  ),
  outroTitle = (
    <>
      THE JOURNEY <span className="text-blue-600 font-black">CONTINUES.</span>
    </>
  ),
  outroSubtitle = (
    <>
      EXPERIENCE VISCERAL DIGITAL STORYTELLING THROUGH{' '}
      <span className="text-blue-600 font-black">UNCOMPROMISING MOTION</span>, ARCHITECTURAL DEPTH, AND{' '}
      <span className="text-blue-600 font-black">BESPOKE INTERACTION</span>.
    </>
  ),
  videoSrc = 'https://res.cloudinary.com/dsuwzuaxp/video/upload/cinematic_drone_videos_shew9q.mp4',
  posterSrc = 'https://res.cloudinary.com/dsuwzuaxp/video/upload/cinematic_drone_videos_shew9q.jpg',
  className = '',
}: LipScrollZoominAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scaleGroupRef = useRef<SVGGElement>(null);
  const globeAccentsRef = useRef<SVGGElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinRef.current || !scaleGroupRef.current) return;

    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    const ctx = gsap.context(() => {
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

      tl.to(
        scaleGroupRef.current,
        {
          scale: 85,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        0
      );

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
      <section className="relative w-full min-h-[75vh] md:min-h-[85vh] bg-white flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 py-12 select-none">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center px-2 sm:px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/15 text-[11px] font-black uppercase tracking-[0.25em] text-black/70 mb-6 bg-black/[0.02]">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>GLOBAL EXPLORATION</span>
          </div>

          <h1 className="text-[10vw] sm:text-[8vw] md:text-[6.2rem] lg:text-[7.2rem] font-black uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6 select-none">
            {title}
          </h1>
          <p className="max-w-3xl text-xs sm:text-sm md:text-base uppercase font-bold leading-relaxed tracking-wider text-black opacity-90">
            {subtitle}
          </p>
        </div>
      </section>

      {/* 2. PURE SOLO WORLD GLOBE SCROLL DIVE SECTION */}
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
          {/* Base Layer: Fullscreen Video */}
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

          {/* EvenOdd Hollow Globe Cutout */}
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

              <g ref={globeAccentsRef} style={{ willChange: 'opacity, transform' }}>
                <path
                  d="M 500 80 A 420 420 0 0 0 500 920"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.25"
                />
                <path
                  d="M 500 920 L 500 970 M 420 970 L 580 970"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.3"
                />
                <line x1="500" y1="80" x2="500" y2="140" stroke="#000000" strokeWidth="6" opacity="0.3" />
                <line x1="500" y1="860" x2="500" y2="920" stroke="#000000" strokeWidth="6" opacity="0.3" />

                <ellipse cx="500" cy="500" rx="360" ry="120" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
                <ellipse cx="500" cy="500" rx="140" ry="360" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
                <line x1="140" y1="500" x2="860" y2="500" stroke="#ffffff" strokeWidth="2" opacity="0.5" strokeDasharray="6 6" />
                <line x1="500" y1="140" x2="500" y2="860" stroke="#ffffff" strokeWidth="2" opacity="0.5" strokeDasharray="6 6" />
              </g>
            </svg>
          </div>

          {/* Ambient Bold Background ATLAS Typography */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-20">
            <span className="text-[34vw] md:text-[38vw] lg:text-[42vw] font-black uppercase tracking-[-0.06em] leading-none text-black/10 select-none whitespace-nowrap">
              ATLAS
            </span>
          </div>
        </div>
      </div>

      {/* 3. OUTRO SECTION */}
      <footer className="relative z-10 w-full min-h-[70vh] md:min-h-[85vh] bg-white text-black flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 py-12 select-none">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center px-2 sm:px-4">
          <h2 className="text-[10vw] sm:text-[8vw] md:text-[6.2rem] lg:text-[7.2rem] font-black uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6 select-none">
            {outroTitle}
          </h2>
          <p className="max-w-3xl text-xs sm:text-sm md:text-base uppercase font-bold leading-relaxed tracking-wider text-black opacity-90">
            {outroSubtitle}
          </p>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
            .motion-section__pin, button, p, span, h1, h2 {
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

export default LipScrollZoominAnimation;
