'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"  // Update this lineimport Loading from "@/components/ui/loading"
import PageHeader from "@/components/ui/page-header"
import { PlusCircle, Rocket, Users } from "lucide-react"
import api from '@/utils/api'
import Loading from '@/components/ui/loading'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      setError('Failed to load dashboard data')
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const navigateTo = (path) => {
    router.push(path)
  }

  if (loading) return <Loading />
  
  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
        <Button 
          variant="outline" 
          onClick={loadDashboardData} 
          className="ml-4"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your customer engagement metrics"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.customers || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Active customers in your CRM</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.activeCampaigns || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Currently running campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.segments || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Customer segments created</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentActivity?.length > 0 ? (
              <ul className="space-y-2">
                {stats.recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-gray-500">{activity.timestamp}</span>
                    <span>{activity.description}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigateTo('/customers/new')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigateTo('/campaigns/new')}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigateTo('/segments/new')}
            >
              <Users className="mr-2 h-4 w-4" />
              Create Segment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}