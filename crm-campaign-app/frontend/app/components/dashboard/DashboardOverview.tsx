'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalMessages: number;
  deliveryRate: number;
  recentCampaigns: Array<{
    id: string;
    name: string;
    status: string;
    sentAt: string;
  }>;
  deliveryTrend: Array<{
    date: string;
    delivered: number;
    failed: number;
  }>;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalCampaigns}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Campaigns</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            {stats.activeCampaigns}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Messages Sent</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalMessages}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Delivery Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {stats.deliveryRate}%
          </p>
        </div>
      </div>

      {/* Delivery Trend Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.deliveryTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="delivered"
                stroke="#4F46E5"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="#EF4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Campaigns</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentCampaigns.map((campaign) => (
            <div key={campaign.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {campaign.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(campaign.sentAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    campaign.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}