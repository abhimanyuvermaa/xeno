'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { fetchCampaigns } from '@/utils/api'
import CampaignTable from '@/components/campaigns/CampaignTable'
import CreateCampaignDialog from '@/components/campaigns/CreateCampaignDialog'
import Loading from '@/components/ui/loading'
import { useToast } from "@/hooks/use-toast"  // Update this lineimport Loading from "@/components/ui/loading"
import { showNotification } from '@/components/ui/notifications'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const data = await fetchCampaigns()
      setCampaigns(data)
    } catch (error) {
      showNotification(toast, {
        title: "Error",
        description: error.message,
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Create Campaign</Button>
      </div>

      <CampaignTable campaigns={campaigns} onRefresh={loadCampaigns} />
      
      <CreateCampaignDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          loadCampaigns()
          showNotification(toast, {
            title: "Success",
            description: "Campaign created successfully",
            type: "success"
          })
        }}
      />
    </div>
  )
}