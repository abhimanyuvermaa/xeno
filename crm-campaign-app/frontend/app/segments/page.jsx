'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { fetchSegments } from '@/utils/api'
import SegmentTable from '@/components/segments/SegmentTable'
import CreateSegmentDialog from '@/components/segments/CreateSegmentDialog'
import Loading from '@/components/ui/loading'
import { useToast } from "@/hooks/use-toast"  // Update this lineimport Loading from "@/components/ui/loading"
import { showNotification } from '@/components/ui/notifications'

export default function SegmentsPage() {
  const [segments, setSegments] = useState([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSegments()
  }, [])

  const loadSegments = async () => {
    try {
      setLoading(true)
      const data = await fetchSegments()
      setSegments(data)
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
        <h1 className="text-3xl font-bold">Segments</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Create Segment</Button>
      </div>

      <SegmentTable segments={segments} onRefresh={loadSegments} />
      
      <CreateSegmentDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          loadSegments()
          showNotification(toast, {
            title: "Success",
            description: "Segment created successfully",
            type: "success"
          })
        }}
      />
    </div>
  )
}