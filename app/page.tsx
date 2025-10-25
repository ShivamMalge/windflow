"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { Analytics } from "@/components/analytics"
import { Maintenance } from "@/components/maintenance"
import { Performance } from "@/components/performance"
import { Settings } from "@/components/settings"
import { Footer } from "@/components/footer"
import { DataInputPage } from "@/components/data-input-page"
import { generateMockData } from "@/lib/mock-data"

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

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [data, setData] = useState<MockData | null>(null)

  useEffect(() => {
    setData(generateMockData())
    const interval = setInterval(() => {
      setData(generateMockData())
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case "analytics":
        return <Analytics />
      case "maintenance":
        return <Maintenance />
      case "performance":
        return <Performance />
      case "settings":
        return <Settings />
      case "data-input":
        return <DataInputPage />
      default:
        return <Dashboard data={data} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto pt-2 px-2 md:px-8 max-w-screen-2xl w-full mx-auto">{renderPage()}</main>
      <Footer />
    </div>
  )
}
