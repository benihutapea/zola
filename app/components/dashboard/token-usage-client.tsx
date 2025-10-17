'use client'

import React, { useState, useEffect } from 'react'
import { TokenUsage } from './token-usage'

// In a real app, you would fetch this data from an API
const useMockTokenUsage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<Array<{
    modelName: string
    tokenCount: number
    percentage: number
  }>>()

  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setData([
        { modelName: 'GPT-4', tokenCount: 56500, percentage: 45 },
        { modelName: 'Claude 3', tokenCount: 37600, percentage: 30 },
        { modelName: 'Gemini', tokenCount: 18800, percentage: 15 },
        { modelName: 'Llama 3', tokenCount: 12500, percentage: 10 }
      ])
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return {
    data,
    isLoading,
    totalTokens: data?.reduce((sum, item) => sum + item.tokenCount, 0) || 0
  }
}

export function TokenUsageClient() {
  const { data, isLoading, totalTokens } = useMockTokenUsage()
  
  return (
    <TokenUsage 
      data={data} 
      isLoading={isLoading} 
      totalTokens={totalTokens}
    />
  )
}