'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ThreeBackgroundDynamic = dynamic(
  () => import('@/components/ui/ThreeBackground').then((mod) => mod.ThreeBackground),
  { ssr: false }
);

export function ClientThreeCanvas() {
  return <ThreeBackgroundDynamic />;
}
