'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
}

interface TemplateEditorProps {
  template?: Template;
  onSave: (template: Omit<Template, 'id'>) => Promise<void>;
}

export default function TemplateEditor({ template, onSave }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || '');
  const [subject, setSubject] = useState(template?.subject || '');
  const [content, setContent] = useState(template?.content || '');
  const [variables, setVariables] = useState<string[]>(template?.variables || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        name,
        subject,
        content,
        variables,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addVariable = () => {
    const variable = prompt('Enter variable name (without brackets):');
    if (variable) {
      setVariables([...variables, variable]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Template Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Template Content
        </label>
        <div className="mt-1">
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Variables
          </label>
          <button
            type="button"
            onClick={addVariable}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Add Variable
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {variables.map((variable) => (
            <span
              key={variable}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {`{{${variable}}}`}
              <button
                type="button"
                onClick={() => setVariables(variables.filter(v => v !== variable))}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSaving ? 'Saving...' : 'Save Template'}
        </button>
      </div>
    </div>
  );
}