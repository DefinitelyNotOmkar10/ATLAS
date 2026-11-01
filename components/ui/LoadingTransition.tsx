"use client";

import dynamic from 'next/dynamic';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

interface LoadingTransitionProps {
  onComplete?: () => void;
}

export default function LoadingTransition({ onComplete }: LoadingTransitionProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#FFF6CB' }}
    >
      <Player
        autoplay
        loop
        src="/loading.json"
        style={{ height: '500px', width: '500px' }}
      />
    </div>
  );
}

