"use client"

import { useState } from "react"
import { KPIGrid } from "./kpi-grid"
import { ChartsSection } from "./charts-section"
import { AlertsPanel } from "./alerts-panel"
import { FilterBar } from "./filter-bar"
import { PerformanceMetrics } from "./performance-metrics"
import { SystemHealth } from "./system-health"

interface MockData {
  windSpeed: number
  maxWindSpeed: number
  minWindSpeed: number
  power: number
  maxPower: number
  minPower: number
  pitch: number
  rotorRPM: number
  genRPM: number
  nacelTemp: number
  gearOilTemp: number
  genTemp: number
  genBearTemp: number
  environTemp: number
  status: string
}

export function Dashboard({ data }: { data: MockData | null }) {
  const [timeRange, setTimeRange] = useState("24h")
  const [selectedMetrics, setSelectedMetrics] = useState(["WindSpeed", "Power", "Pitch"])
  const [status, setStatus] = useState("all")

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-screen-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>
        <FilterBar timeRange={timeRange} onTimeRangeChange={setTimeRange} status={status} onStatusChange={setStatus} />

        <SystemHealth data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <KPIGrid data={data} />
          </div>
          <div className="lg:col-span-1">
            <AlertsPanel data={data} />
          </div>
        </div>

        <PerformanceMetrics data={data} timeRange={timeRange} />

        <ChartsSection data={data} timeRange={timeRange} selectedMetrics={selectedMetrics} />
      </main>
    </div>
  )
}
