import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Search from "@/components/ui/search"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/utils/format"

export default function SegmentTable({ segments }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSegments = segments.filter(segment => 
    segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCriteria = (criteria) => {
    const parts = []
    if (criteria.spendingThreshold) parts.push(`Min spend: ₹${criteria.spendingThreshold}`)
    if (criteria.visitCount) parts.push(`Min visits: ${criteria.visitCount}`)
    if (criteria.lastVisitDays) parts.push(`Last visit: ${criteria.lastVisitDays} days`)
    return parts.join(' • ') || 'No criteria'
  }

  return (
    <div className="space-y-4">
      <Search 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search segments..."
      />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Criteria</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Customers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSegments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No segments found
                </TableCell>
              </TableRow>
            ) : (
              filteredSegments.map((segment) => (
                <TableRow key={segment._id}>
                  <TableCell className="font-medium">{segment.name}</TableCell>
                  <TableCell>{segment.description || '-'}</TableCell>
                  <TableCell>{formatCriteria(segment.criteria)}</TableCell>
                  <TableCell>{formatDate(segment.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {segment.customerCount || 0} customers
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}