import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { segmentSchema } from "@/utils/validations"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import api from '@/utils/api'

export default function CreateSegmentDialog({ open, onOpenChange, onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(segmentSchema)
  })

  const onSubmit = async (data) => {
    try {
      await api.post('/segments', {
        ...data,
        criteria: {
          spendingThreshold: Number(data.criteria.spendingThreshold) || undefined,
          visitCount: Number(data.criteria.visitCount) || undefined,
          lastVisitDays: Number(data.criteria.lastVisitDays) || undefined
        }
      })
      onSuccess()
      onOpenChange(false)
      reset()
    } catch (error) {
      console.error('Error creating segment:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Segment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input {...register("description")} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Segment Criteria</h3>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Define at least one criteria for the segment</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div>
              <label className="text-sm font-medium">Minimum Spending (₹)</label>
              <Input 
                type="number" 
                {...register("criteria.spendingThreshold")} 
              />
            </div>

            <div>
              <label className="text-sm font-medium">Minimum Visits</label>
              <Input 
                type="number" 
                {...register("criteria.visitCount")} 
              />
            </div>

            <div>
              <label className="text-sm font-medium">Days Since Last Visit</label>
              <Input 
                type="number" 
                {...register("criteria.lastVisitDays")} 
              />
            </div>
          </div>

          {errors.criteria && (
            <p className="text-sm text-red-500">{errors.criteria.message}</p>
          )}

          <Button type="submit" className="w-full">Create Segment</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}