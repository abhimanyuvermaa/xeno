'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface CommunicationLog {
  id: string;
  status: string;
  sentAt: string;
  messageId?: string;
  customer: {
    name: string;
    email: string;
  };
  error?: string;
}

interface CommunicationStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  deliveryRate: number;
}

interface CommunicationLogsProps {
  campaignId: string;
  refreshInterval?: number;
}

export default function CommunicationLogs({ 
  campaignId, 
  refreshInterval = 5000 
}: CommunicationLogsProps) {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/logs`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      
      setLogs(data.logs);
      setStats({
        ...data.stats,
        deliveryRate: data.stats.total > 0 
          ? (data.stats.sent / data.stats.total) * 100 
          : 0
      });
      setError('');

      // Stop auto-refresh if campaign is complete
      if (!data.logs.some(log => log.status === 'PENDING')) {
        setAutoRefresh(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAutoRefresh(false);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchLogs();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, refreshInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchLogs, autoRefresh, refreshInterval]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Invalid date';
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
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading logs</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium text-gray-500">Total Messages</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium text-gray-500">Sent</div>
              <div className="mt-1 text-2xl font-semibold text-green-600">{stats.sent}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium text-gray-500">Failed</div>
              <div className="mt-1 text-2xl font-semibold text-red-600">{stats.failed}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium text-gray-500">Pending</div>
              <div className="mt-1 text-2xl font-semibold text-yellow-600">{stats.pending}</div>
            </div>
          </div>

          {/* Delivery Rate Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Delivery Rate</h3>
              <span className="text-2xl font-bold text-indigo-600">
                {stats.deliveryRate.toFixed(1)}%
              </span>
            </div>
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${stats.deliveryRate}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Auto-refresh Toggle */}
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
            autoRefresh 
              ? 'border-indigo-500 text-indigo-500 hover:bg-indigo-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
        </button>
        <button
          onClick={fetchLogs}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh Now
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.customer.name}</div>
                    <div className="text-sm text-gray-500">{log.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.sentAt ? formatTime(log.sentAt) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.messageId || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                    {log.error || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No communication logs found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}