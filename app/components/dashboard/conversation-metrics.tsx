import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { motion } from 'framer-motion'

// Sample data - in real implementation, this would come from an API
const sampleData = {
  dailyUsage: [
    { date: '10/10', tokens: 2500, messages: 35 },
    { date: '10/11', tokens: 3200, messages: 42 },
    { date: '10/12', tokens: 4100, messages: 38 },
    { date: '10/13', tokens: 2900, messages: 30 },
    { date: '10/14', tokens: 3800, messages: 45 },
    { date: '10/15', tokens: 4300, messages: 50 },
    { date: '10/16', tokens: 3600, messages: 41 }
  ],
  modelUsage: [
    { name: 'GPT-4', value: 45 },
    { name: 'Claude 3', value: 30 },
    { name: 'Gemini', value: 15 },
    { name: 'Llama 3', value: 10 }
  ],
  topTopics: [
    { name: 'Coding', count: 25 },
    { name: 'Research', count: 18 },
    { name: 'Writing', count: 15 },
    { name: 'General', count: 12 },
    { name: 'Creative', count: 8 }
  ]
}

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-card rounded-xl p-4 shadow-sm"
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
  </motion.div>
);

export const ConversationMetrics = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [metrics, setMetrics] = useState({
    totalMessages: 0,
    totalTokens: 0,
    avgMessagesPerDay: 0,
    avgTokensPerMessage: 0
  });

  // Calculate summary metrics
  useEffect(() => {
    const totalMessages = sampleData.dailyUsage.reduce((sum, day) => sum + day.messages, 0);
    const totalTokens = sampleData.dailyUsage.reduce((sum, day) => sum + day.tokens, 0);
    const days = sampleData.dailyUsage.length;
    
    setMetrics({
      totalMessages,
      totalTokens,
      avgMessagesPerDay: Math.round(totalMessages / days),
      avgTokensPerMessage: Math.round(totalTokens / totalMessages)
    });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-4">Conversation Insights</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Messages"
            value={metrics.totalMessages}
            subtitle="Last 7 days"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
          />
          <MetricCard
            title="Total Tokens"
            value={metrics.totalTokens.toLocaleString()}
            subtitle="Last 7 days"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 12h-6.5a2.5 2.5 0 0 0 0 5H16"></path><path d="M10 7h4"></path></svg>}
          />
          <MetricCard
            title="Avg Messages/Day"
            value={metrics.avgMessagesPerDay}
            subtitle="Last 7 days"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
          />
          <MetricCard
            title="Avg Tokens/Message"
            value={metrics.avgTokensPerMessage}
            subtitle="Last 7 days"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7"></path><path d="M15 7h6v6"></path></svg>}
          />
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Usage Statistics</h3>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="models">Models</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="daily" className="mt-0 p-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sampleData.dailyUsage}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="tokens" name="Tokens" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="messages" name="Messages" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="models" className="mt-0 p-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sampleData.modelUsage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {sampleData.modelUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                {sampleData.modelUsage.map((model, index) => (
                  <div key={model.name} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{model.name}</span>
                    <Badge variant="outline" className="ml-auto">{model.value}%</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="topics" className="mt-0 p-0">
              <div className="space-y-4">
                {sampleData.topTopics.map((topic) => (
                  <div key={topic.name} className="flex items-center">
                    <span className="text-sm font-medium">{topic.name}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(topic.count / Math.max(...sampleData.topTopics.map(t => t.count))) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <Badge>{topic.count} chats</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </motion.div>
  );
}