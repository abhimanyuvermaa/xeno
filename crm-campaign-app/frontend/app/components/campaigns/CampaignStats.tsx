'use client';

import { useState } from 'react';
import { Campaign } from '@/app/types/next-auth';

interface CampaignStatsProps {
  campaign: Campaign;
  onExecute: () => void;
}

export default function CampaignStats({ campaign, onExecute }: CampaignStatsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExecute = async () => {
    if (!confirm('Are you sure you want to execute this campaign?')) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/campaigns/${campaign.id}/execute`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to execute campaign');
      }

      onExecute();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'FAILED':
        return 'text-red-600';
      case 'IN_PROGRESS':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Campaign Status</h3>
          <p className={`mt-1 ${getStatusColor(campaign.status)}`}>
            {campaign.status}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Scheduled For</h3>
          <p className="mt-1 text-gray-500">
            {new Date(campaign.scheduledDate).toLocaleString()}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleExecute}
          disabled={loading || ['COMPLETED', 'FAILED', 'IN_PROGRESS'].includes(campaign.status)}
          className={`w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading || ['COMPLETED', 'FAILED', 'IN_PROGRESS'].includes(campaign.status)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {loading ? 'Executing...' : 'Execute Campaign'}
        </button>
      </div>
    </div>
  );
}