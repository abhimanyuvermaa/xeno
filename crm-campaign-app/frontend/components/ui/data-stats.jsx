import { Card, CardContent } from "@/components/ui/card"
import { formatNumber, formatCurrency } from "@/utils/format"

export default function DataStats({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            <div className="text-2xl font-bold mt-2">
              {stat.isCurrency 
                ? formatCurrency(stat.value)
                : formatNumber(stat.value)}
            </div>
            {stat.change && (
              <div className={`text-sm mt-1 ${
                stat.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}