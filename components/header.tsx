export function Header() {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">EnergyFlow Dashboard</h1>
            <p className="text-muted-foreground mt-1">Advanced turbine analytics & monitoring</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Turbine: WT-2024-001</p>
            <p className="text-sm text-secondary font-semibold">Status: Optimal</p>
          </div>
        </div>
      </div>
    </header>
  )
}
