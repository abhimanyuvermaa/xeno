'use client';

import { useState, useEffect } from 'react';
import TemplateEditor from '@/components/TemplateEditor';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSaveTemplate = async (templateData: any) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      await fetchTemplates();
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Email Templates
          </h1>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Template
          </button>
        </div>

        {isCreating ? (
          <div className="bg-white shadow rounded-lg p-6">
            <TemplateEditor onSave={handleSaveTemplate} />
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template: any) => (
              <div
                key={template.id}
                className="bg-white shadow rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {template.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{template.subject}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}