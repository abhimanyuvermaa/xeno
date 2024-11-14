'use client';

import { useAuth } from '@/hooks/useAuth';
import DashboardOverview from '@/app/components/dashboard/DashboardOverview';

export default function Dashboard() {
  const { session } = useAuth();

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="mt-6">
          <DashboardOverview />
        </div>
      </div>
    </div>
  );
}