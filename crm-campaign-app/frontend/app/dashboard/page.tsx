'use client';

import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { session } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6">
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Welcome, {session?.user?.name || session?.user?.email}!
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>This is your dashboard overview.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}