import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

// Sample data - in a real app, this would come from an API
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

// Define a type that conforms to recharts' ChartDataInput requirements
interface TokenUsageData {
  modelName: string
  tokenCount: number
  percentage: number
  [key: string]: string | number // Index signature for recharts compatibility
}

interface TokenUsageProps {
  data?: TokenUsageData[]
  isLoading?: boolean
  totalTokens?: number
}

export function TokenUsage({ 
  data, 
  isLoading = false, 
  totalTokens = 0 
}: TokenUsageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  // For development/preview, use sample data if none provided
  const displayData = data || [
    { modelName: 'GPT-4', tokenCount: 56500, percentage: 45 },
    { modelName: 'Claude 3', tokenCount: 37600, percentage: 30 },
    { modelName: 'Gemini', tokenCount: 18800, percentage: 15 },
    { modelName: 'Llama 3', tokenCount: 12500, percentage: 10 }
  ]

  const displayTotal = totalTokens || displayData.reduce((sum, item) => sum + item.tokenCount, 0)

  if (isLoading) {
    return (
      <div className="h-60 flex items-center justify-center flex-col gap-4">
        <Skeleton className="h-40 w-40 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="tokenCount"
            >
              {displayData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                `${value.toLocaleString()} tokens`, 
                "Usage"
              ]}
              labelFormatter={(index) => displayData[index].modelName}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center">
        <div className="text-sm text-muted-foreground">Total Usage</div>
        <div className="text-2xl font-bold mt-1">
          {displayTotal.toLocaleString()} tokens
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {displayData.map((model, index) => (
          <div key={model.modelName} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{model.modelName}</span>
            <span className="text-muted-foreground ml-auto">
              {model.percentage}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}