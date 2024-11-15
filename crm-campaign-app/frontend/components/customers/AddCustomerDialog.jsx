import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { customerSchema } from "@/utils/validations"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"  // Update this lineimport Loading from "@/components/ui/loading"
import { showNotification } from '@/components/ui/notifications'
import api from '@/utils/api'

export default function AddCustomerDialog({ open, onOpenChange, onSuccess }) {
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(customerSchema)
  })

  const onSubmit = async (data) => {
    try {
      await api.post('/customers', data)
      onSuccess()
      onOpenChange(false)
      reset()
      showNotification(toast, {
        title: "Success",
        description: "Customer added successfully",
        type: "success"
      })
    } catch (error) {
      showNotification(toast, {
        title: "Error",
        description: error.message,
        type: "error"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
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
            <label className="text-sm font-medium">Email</label>
            <Input {...register("email")} type="email" />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Input {...register("address")} />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">Add Customer</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}