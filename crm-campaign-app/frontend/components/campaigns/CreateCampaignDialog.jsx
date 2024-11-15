import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { campaignSchema } from "@/utils/validations"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"  // Change this line
import { useState, useEffect } from 'react'
import api from '@/utils/api'

export default function CreateCampaignDialog({ open, onOpenChange, onSuccess }) {
  const [segments, setSegments] = useState([])
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(campaignSchema)
  })

  useEffect(() => {
    loadSegments()
  }, [])

  const loadSegments = async () => {
    try {
      const response = await api.get('/segments')
      setSegments(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load segments",
        variant: "destructive"
      })
    }
  }

  const onSubmit = async (data) => {
    try {
      await api.post('/campaigns', {
        ...data,
        budget: Number(data.budget)
      })
      onSuccess()
      onOpenChange(false)
      reset()
      toast({
        title: "Success",
        description: "Campaign created successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Campaign Name</label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea {...register("description")} />
          </div>

          <div>
            <label className="text-sm font-medium">Target Segment</label>
            <Select onValueChange={(value) => register("segmentId").onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a segment" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((segment) => (
                  <SelectItem key={segment._id} value={segment._id}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input type="date" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input type="date" {...register("endDate")} />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Budget (₹)</label>
            <Input type="number" {...register("budget")} />
            {errors.budget && (
              <p className="text-sm text-red-500">{errors.budget.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">Create Campaign</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}