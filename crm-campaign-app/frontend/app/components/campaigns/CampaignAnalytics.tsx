'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface CampaignAnalyticsProps {
  campaignId: string;
}

export default function CampaignAnalytics({ campaignId }: CampaignAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [campaignId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/analytics`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  if (!analytics) return null;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const deliveryData = [
    { name: 'Sent', value: analytics.deliveryMetrics.sent },
    { name: 'Failed', value: analytics.deliveryMetrics.failed },
    { name: 'Pending', value: analytics.deliveryMetrics.pending },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Delivery Rate Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Rate</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {analytics.deliveryMetrics.deliveryRate.toFixed(1)}%
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {analytics.deliveryMetrics.sent} of {analytics.deliveryMetrics.total} messages delivered
          </div>
        </div>

        {/* Time Metrics Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Time Metrics</h3>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-500">Average Delivery Time</div>
              <div className="text-xl font-semibold">
                {analytics.timeMetrics.averageDeliveryTime.toFixed(1)}s
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Peak Delivery Time</div>
              <div className="text-xl font-semibold">
                {analytics.timeMetrics.peakDeliveryTime}
              </div>
            </div>
          </div>
        </div>

        {/* Segment Coverage Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Segment Coverage</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {analytics.customerSegmentation.segmentCoverage.toFixed(1)}%
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {analytics.customerSegmentation.segmentSize} of {analytics.customerSegmentation.totalCustomers} customers
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deliveryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Campaign Duration', value: analytics.timeMetrics.campaignDuration },
                  { name: 'Avg Delivery Time', value: analytics.timeMetrics.averageDeliveryTime },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}