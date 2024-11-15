'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { fetchCustomers } from '@/utils/api'
import CustomerTable from '@/components/customers/CustomerTable'
import AddCustomerDialog from '@/components/customers/AddCustomerDialog'
import Loading from '@/components/ui/loading'
import { useToast } from "@/hooks/use-toast"  // Update this lineimport Loading from "@/components/ui/loading"
import { showNotification } from '@/components/ui/notifications'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await fetchCustomers()
      setCustomers(data)
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
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Customer</Button>
      </div>

      <CustomerTable customers={customers} onRefresh={loadCustomers} />
      
      <AddCustomerDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          loadCustomers()
          showNotification(toast, {
            title: "Success",
            description: "Customer added successfully",
            type: "success"
          })
        }}
      />
    </div>
  )
}