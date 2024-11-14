'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SettingsForm {
  companyName: string;
  emailFromName: string;
  emailFromAddress: string;
  emailSignature: string;
  smsFromNumber: string;
}

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>();

  const onSubmit = async (data: SettingsForm) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to save settings');
      
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Campaign Settings</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            {...register('companyName', { required: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">Company name is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email From Name
          </label>
          <input
            type="text"
            {...register('emailFromName', { required: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email From Address
          </label>
            <input
              type="email"
              {...register('emailFromAddress', { 
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Signature
            </label>
            <textarea
              {...register('emailSignature')}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SMS From Number
            </label>
            <input
              type="text"
              {...register('smsFromNumber')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    );
}