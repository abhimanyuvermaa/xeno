"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Campaign } from "@/app/types/next-auth";
import CampaignStats from "@/app/components/campaigns/CampaignStats";
import CommunicationLogs from "@/app/components/campaigns/CommunicationLogs";

export default function CampaignDetail({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCampaign();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch campaign");
      const data = await response.json();
      setCampaign(data);
    } catch (error) {
      console.error("Error fetching campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!campaign) return <div>Campaign not found</div>;

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {campaign.name}
          </h1>
          <p className="mt-2 text-sm text-gray-700">{campaign.description}</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/campaigns")}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Campaigns
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Campaign Details
          </h2>
          <dl className="grid grid-cols-1 gap-4">
            <div className="bg-white shadow rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{campaign.type}</dd>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">Message</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {campaign.message.body}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Campaign Statistics
          </h2>
          <CampaignStats campaign={campaign} onExecute={fetchCampaign} />
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Communication Logs
          </h2>
          <CommunicationLogs campaignId={params.id} />
        </div>
      </div>
    </div>
  );
}
