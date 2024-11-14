'use client';
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">CRM Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Customers"
          description="Manage your customer database"
          link="/customers"
        />
        <DashboardCard
          title="Segments"
          description="Create and manage customer segments"
          link="/segments"
        />
        <DashboardCard
          title="Campaigns"
          description="Run targeted marketing campaigns"
          link="/campaigns"
        />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  link: string;
}

function DashboardCard({ title, description, link }: DashboardCardProps) {
  return (
    <Link href={link}>
      <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}