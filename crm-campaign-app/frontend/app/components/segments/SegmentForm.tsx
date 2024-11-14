'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SegmentFormProps {
  onClose: () => void;
}

export default function SegmentForm({ onClose }: SegmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: {
      minPurchaseAmount: 0,
      minVisitCount: 0,
      lastVisitDays: 0,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create segment');
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error('Error creating segment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Segment Rules</h3>
        
        <div>
          <label htmlFor="minPurchaseAmount" className="block text-sm font-medium text-gray-700">
            Minimum Purchase Amount
          </label>
          <input
            type="number"
            id="minPurchaseAmount"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.rules.minPurchaseAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                rules: { ...formData.rules, minPurchaseAmount: Number(e.target.value) },
              })
            }
          />
        </div>

        <div>
          <label htmlFor="minVisitCount" className="block text-sm font-medium text-gray-700">
            Minimum Visit Count
          </label>
          <input
            type="number"
            id="minVisitCount"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.rules.minVisitCount}
            onChange={(e) =>
              setFormData({
                ...formData,
                rules: { ...formData.rules, minVisitCount: Number(e.target.value) },
              })
            }
          />
        </div>

        <div>
          <label htmlFor="lastVisitDays" className="block text-sm font-medium text-gray-700">
            Last Visit (Days)
          </label>
          <input
            type="number"
            id="lastVisitDays"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.rules.lastVisitDays}
            onChange={(e) =>
              setFormData({
                ...formData,
                rules: { ...formData.rules, lastVisitDays: Number(e.target.value) },
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'Creating...' : 'Create Segment'}
        </button>
      </div>
    </form>
  );
}