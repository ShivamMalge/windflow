"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FilterBar({ timeRange, onTimeRangeChange, status, onStatusChange }) {
  const timeRanges = [
    { label: "1H", value: "1h" },
    { label: "24H", value: "24h" },
    { label: "7D", value: "7d" },
    { label: "30D", value: "30d" },
  ]

  const statuses = [
    { label: "All Turbines", value: "all" },
    { label: "Active", value: "active" },
    { label: "Idle", value: "idle" },
    { label: "Maintenance", value: "maintenance" },
  ]

  const handleExport = () => {
    // Generate CSV export
    const csvContent = "data:text/csv;charset=utf-8,Timestamp,WindSpeed,Power,Pitch\n"
    const link = document.createElement("a")
    link.setAttribute("href", csvContent)
    link.setAttribute("download", `turbine-report-${new Date().toISOString()}.csv`)
    link.click()
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 bg-card border border-border rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {/* Time range buttons */}
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeRangeChange(range.value)}
              className={timeRange === range.value ? "bg-primary text-primary-foreground" : ""}
            >
              {range.label}
            </Button>
          ))}
        </div>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleExport} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
        <Download className="w-4 h-4" />
        Export Report
      </Button>
    </div>
  )
}
