"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

export function PerformanceMetrics({ data, timeRange }) {
  const performanceData = [
    { name: "Efficiency", value: 92, target: 95 },
    { name: "Availability", value: 98, target: 99 },
    { name: "Capacity Factor", value: 87, target: 90 },
    { name: "Uptime", value: 99.5, target: 99.8 },
  ]

  const predictiveData = [
    { day: "Mon", maintenance: 2, alerts: 1 },
    { day: "Tue", maintenance: 1, alerts: 0 },
    { day: "Wed", maintenance: 3, alerts: 2 },
    { day: "Thu", maintenance: 1, alerts: 1 },
    { day: "Fri", maintenance: 2, alerts: 0 },
    { day: "Sat", maintenance: 0, alerts: 0 },
    { day: "Sun", maintenance: 1, alerts: 1 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Legend />
            <Bar dataKey="value" fill="var(--chart-1)" name="Current" />
            <Bar dataKey="target" fill="var(--chart-2)" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Predictive Maintenance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictiveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Legend />
            <Line type="monotone" dataKey="maintenance" stroke="var(--chart-1)" name="Maintenance Tasks" />
            <Line type="monotone" dataKey="alerts" stroke="var(--chart-4)" name="Alerts" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
