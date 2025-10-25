"use client"

import { Activity, Zap, Thermometer, Gauge } from "lucide-react"

export function SystemHealth({ data }) {
  const healthMetrics = [
    {
      icon: Activity,
      label: "System Status",
      value: "Healthy",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Zap,
      label: "Power Output",
      value: "485 kW",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Thermometer,
      label: "Avg Temperature",
      value: "42°C",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: Gauge,
      label: "Efficiency",
      value: "92%",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {healthMetrics.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <div key={idx} className={`${metric.bgColor} border border-border rounded-lg p-4 shadow-sm`}>
            <div className="flex items-center gap-3">
              <Icon className={`w-8 h-8 ${metric.color}`} />
              <div>
                <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                <p className={`text-lg font-semibold ${metric.color}`}>{metric.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
