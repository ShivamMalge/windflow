"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, AlertCircle, CheckCircle, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AlertsPanel({ data }) {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())

  const safeData = data || {
    windSpeed: 0,
    power: 0,
    genTemp: 0,
    nacelTemp: 0,
    gearOilTemp: 0,
  }

  const allAlerts = useMemo(
    () => [
      // Critical alerts
      {
        id: 1,
        severity: "critical",
        title: "Critical: High Wind Speed",
        message: `Current: ${safeData.windSpeed.toFixed(1)} m/s (Threshold: 18 m/s)`,
        visible: safeData.windSpeed > 18,
        icon: AlertTriangle,
      },
      {
        id: 2,
        severity: "critical",
        title: "Critical: Generator Overheating",
        message: `Current: ${safeData.genTemp.toFixed(1)}°C (Threshold: 80°C)`,
        visible: safeData.genTemp > 80,
        icon: Zap,
      },
      // Warning alerts
      {
        id: 3,
        severity: "warning",
        title: "Warning: High Wind Speed",
        message: `Current: ${safeData.windSpeed.toFixed(1)} m/s (Threshold: 15 m/s)`,
        visible: safeData.windSpeed > 15 && safeData.windSpeed <= 18,
        icon: AlertTriangle,
      },
      {
        id: 4,
        severity: "warning",
        title: "Warning: Low Power Output",
        message: `Current: ${safeData.power.toFixed(0)} kW (Threshold: 100 kW)`,
        visible: safeData.power < 100,
        icon: AlertCircle,
      },
      {
        id: 5,
        severity: "warning",
        title: "Warning: Elevated Nacelle Temperature",
        message: `Current: ${safeData.nacelTemp.toFixed(1)}°C (Threshold: 60°C)`,
        visible: safeData.nacelTemp > 60,
        icon: AlertCircle,
      },
      {
        id: 6,
        severity: "warning",
        title: "Warning: High Gear Oil Temperature",
        message: `Current: ${safeData.gearOilTemp.toFixed(1)}°C (Threshold: 70°C)`,
        visible: safeData.gearOilTemp > 70,
        icon: AlertCircle,
      },
      // Info alerts
      {
        id: 7,
        severity: "info",
        title: "Maintenance Due",
        message: "Next scheduled: 15 days",
        visible: true,
        icon: AlertCircle,
      },
      {
        id: 8,
        severity: "success",
        title: "System Healthy",
        message: "All parameters nominal",
        visible: true,
        icon: CheckCircle,
      },
    ],
    [safeData],
  )

  const visibleAlerts = useMemo(
    () => allAlerts.filter((a) => a.visible && !dismissedAlerts.has(a.id)),
    [allAlerts, dismissedAlerts],
  )

  const criticalAlerts = visibleAlerts.filter((a) => a.severity === "critical")
  const warningAlerts = visibleAlerts.filter((a) => a.severity === "warning")
  const infoAlerts = visibleAlerts.filter((a) => a.severity === "info" || a.severity === "success")

  const handleDismiss = (alertId) => {
    const newDismissed = new Set(dismissedAlerts)
    newDismissed.add(alertId)
    setDismissedAlerts(newDismissed)
  }

  const handleClearAll = () => {
    setDismissedAlerts(new Set(visibleAlerts.map((a) => a.id)))
  }

  const renderAlertItem = (alert) => {
    const Icon = alert.icon
    const bgColor =
      alert.severity === "critical"
        ? "bg-red-500/10 border-red-500"
        : alert.severity === "warning"
          ? "bg-yellow-500/10 border-yellow-500"
          : alert.severity === "info"
            ? "bg-blue-500/10 border-blue-500"
            : "bg-green-500/10 border-green-500"

    const iconColor =
      alert.severity === "critical"
        ? "text-red-500"
        : alert.severity === "warning"
          ? "text-yellow-500"
          : alert.severity === "info"
            ? "text-blue-500"
            : "text-green-500"

    return (
      <div key={alert.id} className={`p-3 rounded-lg border flex gap-3 ${bgColor}`}>
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">{alert.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
        </div>
        <button
          onClick={() => handleDismiss(alert.id)}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Alerts & Status</h3>
          {visibleAlerts.length > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
              {visibleAlerts.length}
            </span>
          )}
        </div>
        {visibleAlerts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">Critical</p>
            <div className="space-y-2">{criticalAlerts.map(renderAlertItem)}</div>
          </div>
        )}

        {/* Warning Alerts */}
        {warningAlerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-yellow-500 uppercase tracking-wide">Warnings</p>
            <div className="space-y-2">{warningAlerts.map(renderAlertItem)}</div>
          </div>
        )}

        {/* Info & Success Alerts */}
        {infoAlerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</p>
            <div className="space-y-2">{infoAlerts.map(renderAlertItem)}</div>
          </div>
        )}

        {/* Empty State */}
        {visibleAlerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">All alerts dismissed</p>
          </div>
        )}
      </div>
    </div>
  )
}
