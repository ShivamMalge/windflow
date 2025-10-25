"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import { generateChartData } from "@/lib/mock-data"
import { Zap, Gauge, Thermometer } from "lucide-react"

export function Performance() {
  const [timeRange, setTimeRange] = useState("24h")
  const chartData = generateChartData(timeRange)

  const performanceMetrics = [
    { label: "Capacity Factor", value: "42.5%", icon: Zap, color: "bg-blue-100 text-blue-600" },
    { label: "Avg Efficiency", value: "94.2%", icon: Gauge, color: "bg-green-100 text-green-600" },
    { label: "Peak Power", value: "598 kW", icon: Zap, color: "bg-purple-100 text-purple-600" },
    { label: "Avg Temperature", value: "38.5°C", icon: Thermometer, color: "bg-orange-100 text-orange-600" },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Performance</h1>
        <p className="text-muted-foreground">Real-time performance metrics and efficiency analysis</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {["1h", "24h", "7d", "30d"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeRange === range
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {range === "1h" ? "1 Hour" : range === "24h" ? "24 Hours" : range === "7d" ? "7 Days" : "30 Days"}
          </button>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <Card key={idx} className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power Generation Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Power Generation Trend</CardTitle>
            <CardDescription>Output over selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorPower)"
                  name="Power (kW)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pitch Angle Performance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Pitch Angle Control</CardTitle>
            <CardDescription>Blade pitch optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
                <Legend />
                <Line type="monotone" dataKey="pitch" stroke="#10b981" strokeWidth={2} name="Pitch Angle (°)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Wind Speed vs Power */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Wind Speed vs Power Output</CardTitle>
            <CardDescription>Performance correlation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="windSpeed" name="Wind Speed (m/s)" stroke="#6b7280" />
                <YAxis dataKey="power" name="Power (kW)" stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                  cursor={{ strokeDasharray: "3 3" }}
                />
                <Scatter name="Power Output" data={chartData} fill="#f59e0b" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Efficiency */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>System Efficiency</CardTitle>
            <CardDescription>Overall system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
                <Area
                  type="monotone"
                  dataKey="pitch"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorEfficiency)"
                  name="Efficiency (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
