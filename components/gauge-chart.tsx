"use client"

export function GaugeChart({ value, max, label }) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 45

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card rounded-lg border border-border">
      <svg width="120" height="120" viewBox="0 0 120 120" className="mb-4">
        {/* Background circle */}
        <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * percentage) / 100}
          strokeLinecap="round"
          className="text-primary transition-all duration-500"
          style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
        />
        {/* Center text */}
        <text x="60" y="65" textAnchor="middle" className="text-lg font-bold fill-foreground">
          {percentage.toFixed(0)}%
        </text>
      </svg>
      <p className="text-sm text-muted-foreground text-center">{label}</p>
    </div>
  )
}
