"use client"

import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

export function KPICard({ metric }) {
  const isPositiveTrend = metric.trend > 0

  return (
    <div
      className={`p-6 rounded-lg border transition-all ${
        metric.warning
          ? "bg-destructive/5 border-destructive shadow-sm"
          : "bg-card border-border shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-bold ${metric.warning ? "text-destructive" : "text-primary"}`}>
              {metric.value.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">{metric.unit}</span>
          </div>
        </div>
        {metric.warning && <AlertTriangle className="w-5 h-5 text-destructive" />}
      </div>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex gap-4">
          <span>Max: {metric.max.toFixed(1)}</span>
          <span>Min: {metric.min.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          {isPositiveTrend ? (
            <TrendingUp className="w-4 h-4 text-secondary" />
          ) : (
            <TrendingDown className="w-4 h-4 text-muted-foreground" />
          )}
          <span className={isPositiveTrend ? "text-secondary" : "text-muted-foreground"}>
            {Math.abs(metric.trend).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
