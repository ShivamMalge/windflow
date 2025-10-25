"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { generateChartData } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

export function Analytics() {
  const [timeRange, setTimeRange] = useState("24h")
  const chartData = generateChartData(timeRange)

  const stats = [
    { label: "Avg Power Output", value: "485 kW", change: "+12%", icon: TrendingUp, color: "text-green-600" },
    { label: "Avg Wind Speed", value: "12.8 m/s", change: "-3%", icon: TrendingDown, color: "text-red-600" },
    { label: "System Uptime", value: "99.2%", change: "+0.5%", icon: Activity, color: "text-blue-600" },
  ]

  const efficiencyData = [
    { name: "Optimal", value: 65 },
    { name: "Good", value: 25 },
    { name: "Fair", value: 8 },
    { name: "Poor", value: 2 },
  ]

  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive data analysis and insights</p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-sm font-medium mt-2 ${stat.color}`}>{stat.change}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power vs Wind Speed */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Power Output vs Wind Speed</CardTitle>
            <CardDescription>Correlation analysis over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
                <Legend />
                <Line type="monotone" dataKey="power" stroke="#3b82f6" strokeWidth={2} name="Power (kW)" />
                <Line type="monotone" dataKey="windSpeed" stroke="#10b981" strokeWidth={2} name="Wind Speed (m/s)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Temperature Trends */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Temperature Trends</CardTitle>
            <CardDescription>System temperature monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
                <Legend />
                <Line type="monotone" dataKey="nacelTemp" stroke="#f59e0b" strokeWidth={2} name="Nacelle (°C)" />
                <Line type="monotone" dataKey="genTemp" stroke="#ef4444" strokeWidth={2} name="Generator (°C)" />
                <Line type="monotone" dataKey="gearOilTemp" stroke="#8b5cf6" strokeWidth={2} name="Gear Oil (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Efficiency Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Efficiency Distribution</CardTitle>
            <CardDescription>Operating efficiency breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RPM Analysis */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>RPM Analysis</CardTitle>
            <CardDescription>Rotor and generator speed</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
                <Legend />
                <Bar dataKey="rotorRPM" fill="#06b6d4" name="Rotor RPM" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
