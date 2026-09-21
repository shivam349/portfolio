'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const HeroAnimalSceneDynamic = dynamic(
  () => import('./HeroAnimalScene').then((mod) => mod.HeroAnimalScene),
  { ssr: false }
);

export function ClientHeroAnimal() {
  return <HeroAnimalSceneDynamic />;
}
