'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  message: {
    subject?: string;
    body: string;
  };
}

export default function CampaignTemplates() {
  const router = useRouter();
  const [templates] = useState<Template[]>([
    {
      id: 'welcome',
      name: 'Welcome Email',
      description: 'Welcome new customers to your platform',
      type: 'EMAIL',
      message: {
        subject: 'Welcome to our platform!',
        body: 'Hello [Name], Welcome to our platform! We\'re excited to have you on board.',
      },
    },
    {
      id: 'promotion',
      name: 'Promotional Offer',
      description: 'Send promotional offers to customers',
      type: 'EMAIL',
      message: {
        subject: 'Special Offer Just for You!',
        body: 'Hi [Name], We have a special offer just for you!',
      },
    },
  ]);

  const createFromTemplate = (template: Template) => {
    router.push(`/dashboard/campaigns/new?template=${template.id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
          <p className="mt-2 text-sm text-gray-500">{template.description}</p>
          <div className="mt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {template.type}
            </span>
          </div>
          <button
            onClick={() => createFromTemplate(template)}
            className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Use Template
          </button>
        </div>
      ))}
    </div>
  );
}