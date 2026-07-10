import { lazy } from 'react';
import { Suspense } from 'react';

// Import dynamic with a different name to avoid conflict
import dynamicImport from 'next/dynamic';

// Use renamed import for dynamic component loading
const LoginComponent = dynamicImport(
  () => import('../../../components/auth/LoginComponent'),
  { ssr: false }
);

// Now we can export the configuration constant without naming conflict
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <LoginComponent />
    </Suspense>
  );
}