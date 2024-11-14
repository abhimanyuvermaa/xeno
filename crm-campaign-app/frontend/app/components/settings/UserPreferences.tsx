'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

interface UserPreferences {
  emailNotifications: boolean;
  dailyDigest: boolean;
  timezone: string;
  language: string;
}

export default function UserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    dailyDigest: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'en',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">User Preferences</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Notifications
            </label>
            <p className="text-sm text-gray-500">
              Receive notifications about campaign status
            </p>
          </div>
          <Switch
            checked={preferences.emailNotifications}
            onChange={(checked) => 
              setPreferences(prev => ({ ...prev, emailNotifications: checked }))
            }
            className={`${
              preferences.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable email notifications</span>
            <span
              className={`${
                preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Daily Digest
            </label>
            <p className="text-sm text-gray-500">
              Receive a daily summary of campaign performance
            </p>
          </div>
          <Switch
            checked={preferences.dailyDigest}
            onChange={(checked) => 
              setPreferences(prev => ({ ...prev, dailyDigest: checked }))
            }
            className={`${
              preferences.dailyDigest ? 'bg-indigo-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable daily digest</span>
            <span
              className={`${
                preferences.dailyDigest ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <select
            value={preferences.timezone}
            onChange={(e) => 
              setPreferences(prev => ({ ...prev, timezone: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Intl.supportedValuesOf('timeZone').map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => 
              setPreferences(prev => ({ ...prev, language: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={savePreferences}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}