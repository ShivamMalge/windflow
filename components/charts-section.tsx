"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { generateChartData } from "@/lib/mock-data"

export function ChartsSection({ data, timeRange, selectedMetrics }) {
  const chartData = generateChartData(timeRange)

  return (
    <div className="space-y-6">
      {/* Wind Speed and Power Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Wind Speed & Power Output</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorWindSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="windSpeed"
              stroke="var(--chart-1)"
              fillOpacity={1}
              fill="url(#colorWindSpeed)"
              name="Wind Speed (m/s)"
            />
            <Area
              type="monotone"
              dataKey="power"
              stroke="var(--chart-2)"
              fillOpacity={1}
              fill="url(#colorPower)"
              name="Power (kW)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Temperature Monitoring */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Temperature Monitoring</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="nacelTemp"
              stroke="var(--chart-3)"
              name="Nacelle Temp (°C)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="genTemp"
              stroke="var(--chart-4)"
              name="Generator Temp (°C)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="gearOilTemp"
              stroke="var(--chart-5)"
              name="Gear Oil Temp (°C)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RPM and Pitch Angle */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Rotor RPM & Pitch Angle</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="rotorRPM"
              stroke="var(--chart-1)"
              name="Rotor RPM"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="pitch"
              stroke="var(--chart-2)"
              name="Pitch Angle (°)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
