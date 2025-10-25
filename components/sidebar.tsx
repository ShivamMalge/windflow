"use client"

import { LayoutDashboard, BarChart3, Wrench, Zap, Settings, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Navbar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "performance", label: "Performance", icon: Zap },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "data-input", label: "Data Input", icon: Database },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
    <nav className="bg-white border-b border-sidebar-border shadow px-8 py-3 flex items-center justify-between max-w-screen-2xl mx-16 mt-4 rounded-3xl">
      {/* Logo and title */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ring-2 ring-blue-300/50 bg-white overflow-hidden">
          <img src="https://res.cloudinary.com/dx9bvma03/image/upload/v1761333127/wind-turbine-logo-design-vector-art-illustration_761413-29479_wbczz9.avif" alt="Wind Turbine Logo" className="object-contain w-12 h-12" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-sidebar-foreground tracking-tight">WindFlow</h1>
          <p className="text-xs text-sidebar-foreground/60 font-medium">Turbine Monitor</p>
        </div>
      </div>
      {/* Nav items */}
      <div className="flex gap-6 md:gap-8 lg:gap-10">
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <span
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`cursor-pointer text-base font-semibold px-2 py-1 rounded-md transition-colors duration-150 select-none ${
                isActive ? "text-blue-700 bg-blue-100" : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </span>
          );
        })}
      </div>
    </nav>
    </>
  );
}

