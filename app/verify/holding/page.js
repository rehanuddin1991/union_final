'use client'
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import VerifyHoldingClient from './verify-holding-client';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">লোড হচ্ছে...</p>}>
      <VerifyHoldingClient />
    </Suspense>
  );
}
