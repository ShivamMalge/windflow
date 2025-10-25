"use client"

import { KPICard } from "./kpi-card"

export function KPIGrid({ data }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  const metrics = [
    {
      label: "Wind Speed",
      value: data.windSpeed || 0,
      unit: "m/s",
      max: data.maxWindSpeed || 20,
      min: data.minWindSpeed || 0,
      warning: (data.windSpeed || 0) > 15,
    },
    {
      label: "Power Output",
      value: data.power || 0,
      unit: "kW",
      max: data.maxPower || 600,
      min: data.minPower || 0,
      warning: (data.power || 0) < 100,
    },
    {
      label: "Pitch Angle",
      value: data.pitch || 0,
      unit: "°",
      max: 90,
      min: 0,
      warning: false,
    },
    {
      label: "Rotor RPM",
      value: data.rotorRPM || 0,
      unit: "rpm",
      max: 12.5,
      min: 0,
      warning: (data.rotorRPM || 0) > 12,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {metrics.map((metric, idx) => (
        <KPICard key={idx} metric={metric} />
      ))}
    </div>
  )
}
