"use client";

import dynamic from 'next/dynamic';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

export default function GeneratingState() {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Player
        autoplay
        loop
        src="/loading.json"
        style={{ height: '400px', width: '400px' }}
      />
    </div>
  );
}


