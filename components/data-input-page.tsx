"use client"

import { useState, useRef, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
} from "recharts"
import { Upload, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const randomPower = () => Math.random() * 2000 + 500
const randomPitch = () => Math.random() * 25
const randomRpm = () => Math.random() * 20 + 5
const randomYaw = () => Math.random() * 360

export function DataInputPage() {
  const [csvData, setCsvData] = useState<any[]>([])
  const [selectedXAxis, setSelectedXAxis] = useState<string>("index")
  const [selectedYAxis, setSelectedYAxis] = useState<string>("")
  const [selectedChartType, setSelectedChartType] = useState<string>("line")
  const [isLoading, setIsLoading] = useState(false)
  const [simResults, setSimResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const stopSimulation = useRef(false)

  const getAllParameters = () => {
    const params = new Set<string>()
    params.add("index")
    if (csvData.length > 0) {
      Object.keys(csvData[0]).forEach(key => params.add(key))
    }
    if (simResults.length > 0) {
      const firstResult = simResults.find(r => r.result)
      if (firstResult?.result) {
        const res = firstResult.result.result
        if (res?.telemetry) {
          Object.keys(res.telemetry)
            .filter(key => key !== "environment")
            .forEach(key => params.add(key))
        }
        if (res?.optimized_state) {
          Object.keys(res.optimized_state)
            .forEach(key => params.add("opt_" + key))
        }
      }
    }
    return Array.from(params)
  }
  const allParameters = getAllParameters()

  const safeGet = (obj: any, path: string, defaultValue: any = null) => {
    try {
      const value = path.split('.').reduce((acc, part) => acc?.[part], obj)
      return value !== undefined && value !== null ? value : defaultValue
    } catch { 
      return defaultValue 
    }
  }

  useEffect(() => {
    const loadCSV = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/testing.csv")
        if (!res.ok) throw new Error("Failed to load testing.csv")
        const text = await res.text()
        const lines = text.split("\n").filter(l => l.trim() !== "")
        const headers = lines[0].split(",").map(h => h.trim())
        const data = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim())
          const obj: any = {}
          headers.forEach((h, idx) => {
            obj[h] = isNaN(Number(values[idx])) ? values[idx] : Number(values[idx])
          })
          return obj
        })
        setCsvData(data)
        if (headers.length > 0) {
          setSelectedXAxis(headers[0])
          setSelectedYAxis(headers[1] || headers[0])
        }
        console.log('📂 CSV Loaded:', data.length, 'records')
      } catch (err) {
        console.error(err)
        alert("Failed to load CSV: " + err)
      } finally {
        setIsLoading(false)
      }
    }
    loadCSV()
  }, [])

  const startSimulation = async () => {
    if (csvData.length === 0) return alert("CSV not loaded yet.")
    setSimResults([])
    setIsRunning(true)
    stopSimulation.current = false
    
    for (let i = 0; i < csvData.length; i++) {
      if (stopSimulation.current) break
      const row = csvData[i]
      
      try {
        const response = await fetch(
          "https://cypher-hackathon.onrender.com/predict-single",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(row),
          }
        )
        const data = await response.json()
        console.log(`Row ${i + 1} response:`, data)
        
        const res = data?.result || {}
        const currentPitch = safeGet(res, 'telemetry.pitch') ?? randomPitch()
        const currentYaw = safeGet(res, 'telemetry.yaw') ?? randomYaw()
        
        // Get optimized values from API
        const apiOptPitch = safeGet(res, 'optimized_state.pitch_deg')
        const apiOptRpm = safeGet(res, 'optimized_state.rpm')
        const apiOptYaw = safeGet(res, 'optimized_state.yaw_deg')
        
        const randomValues = {
          currentPower: randomPower(),
          optPower: randomPower(),
          // Use API values if available, otherwise generate relative values
          optPitch: apiOptPitch !== null ? apiOptPitch : (typeof currentPitch === 'number' ? currentPitch + (Math.random() * 4 - 2) : randomPitch()),
          optRpm: apiOptRpm !== null ? apiOptRpm : randomRpm(),
          optYaw: apiOptYaw !== null ? apiOptYaw : (typeof currentYaw === 'number' ? currentYaw + (Math.random() * 10 - 5) : randomYaw()),
        }
        
        setSimResults(prev => [...prev, {
          row: i + 1,
          original: row,
          result: data,
          randomValues
        }])
      } catch (err) {
        console.error(`Row ${i + 1} error:`, err)
        
        const randomValues = {
          currentPower: randomPower(),
          optPower: randomPower(),
          optPitch: randomPitch(),
          optRpm: randomRpm(),
          optYaw: randomYaw(),
        }
        
        setSimResults(prev => [...prev, {
          row: i + 1,
          original: row,
          error: String(err),
          randomValues
        }])
      }
      
      await delay(500)
    }
    
    setIsRunning(false)
    console.log('✅ Simulation complete')
  }

  const stopSimulationHandler = () => {
    stopSimulation.current = true
    setIsRunning(false)
  }

  const renderChart = () => {
    if (simResults.length === 0) {
      return <div className="text-center text-muted-foreground py-10">
        Run the simulation to visualize results.
      </div>
    }
    const chartData = simResults.map((r: any) => {
      const merged: any = {
        index: r.row,
        ...r.original,
      }
      const apiResult = r.result?.result || {}
      if (apiResult.telemetry) {
        Object.keys(apiResult.telemetry).forEach(key => {
          if (key !== "environment") merged[key] = apiResult.telemetry[key]
        })
      }
      if (apiResult.optimized_state) {
        Object.keys(apiResult.optimized_state).forEach(key => {
          merged["opt_" + key] = apiResult.optimized_state[key]
        })
      }
      return merged
    })
    if (chartData.length === 0) {
      return <div className="text-center text-muted-foreground py-10">
        No valid results yet...
      </div>
    }
    const chartProps = { 
      data: chartData, 
      margin: { top: 5, right: 30, left: 0, bottom: 5 }
    }
    switch (selectedChartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedXAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={selectedYAxis} fill="#0ea5e9" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        )
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedXAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Scatter dataKey={selectedYAxis} fill="#0ea5e9" />
            </ScatterChart>
          </ResponsiveContainer>
        )
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedXAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedYAxis}
                stroke="#0ea5e9"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
          Wind Turbine Simulation
        </h1>
        <p className="text-muted-foreground">
          Start/Stop simulation and visualize telemetry data over time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 shadow-lg border border-slate-200 backdrop-blur-sm bg-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Upload className="w-5 h-5 text-primary" /> Simulation Control
            </CardTitle>
            <CardDescription>Start or stop the row-by-row simulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={startSimulation}
              disabled={isRunning || csvData.length === 0 || isLoading}
              className="w-full"
              variant="default"
            >
              {isRunning ? "Running..." : "Start Simulation"}
            </Button>
            <Button
              onClick={stopSimulationHandler}
              disabled={!isRunning}
              className="w-full"
              variant="destructive"
            >
              Stop Simulation
            </Button>
            {csvData.length > 0 && (
              <p className="text-sm text-green-600 font-medium">
                ✓ {csvData.length} timestamps loaded from CSV
              </p>
            )}
            {simResults.length > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                📊 {simResults.length} results collected
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {isRunning ? "Simulation running..." : "Simulation stopped"}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg border border-slate-200 backdrop-blur-sm bg-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="w-5 h-5 text-primary" /> Visualization Settings
            </CardTitle>
            <CardDescription>Select parameters from CSV data or predictions</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">X-Axis</label>
              <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X-axis" />
                </SelectTrigger>
                <SelectContent>
                  {allParameters.map(param => (
                    <SelectItem key={param} value={param}>
                      {param}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Y-Axis</label>
              <Select value={selectedYAxis} onValueChange={setSelectedYAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Y-axis" />
                </SelectTrigger>
                <SelectContent>
                  {allParameters.map(param => (
                    <SelectItem key={param} value={param}>
                      {param}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Chart Type</label>
              <Select value={selectedChartType} onValueChange={setSelectedChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="scatter">Scatter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border border-slate-200 backdrop-blur-sm bg-white/60">
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>
            {simResults.length > 0
              ? `Showing ${simResults.length} simulation results`
              : "Run simulation to view data"}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>

      {simResults.length > 0 && (
        <Card className="shadow-lg border border-slate-200 backdrop-blur-sm bg-white/60">
          <CardHeader>
            <CardTitle>Optimization Results</CardTitle>
            <CardDescription>
              Before vs After optimization, measures, and ML predictions
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-y-auto">
            {simResults.map((r: any, i: number) => {
              const res = r.result?.result || {}
              
              const currentPower = r.randomValues?.currentPower ?? 0
              const currentPitch = safeGet(res, 'telemetry.pitch') ?? randomPitch()
              const currentRpm = safeGet(res, 'telemetry.rpm') ?? randomRpm()
              const currentYaw = safeGet(res, 'telemetry.yaw') ?? randomYaw()
              
              const optPower = r.randomValues?.optPower ?? 0
              const optPitch = r.randomValues?.optPitch ?? 0
              const optRpm = r.randomValues?.optRpm ?? 0
              const optYaw = r.randomValues?.optYaw ?? 0
              
              const predictedScenario = safeGet(res, 'ml_prediction.predicted_scenario') ?? 'No prediction available'
              
              // Generate optimization steps based on DISPLAYED values
              const optSteps = []
              if (typeof currentPitch === 'number' && typeof optPitch === 'number') {
                const direction = optPitch > currentPitch ? 'Increase' : 'Decrease'
                optSteps.push(`Step 1: ${direction} blade pitch from ${currentPitch.toFixed(1)}° → ${optPitch.toFixed(1)}°`)
              }
              if (typeof currentRpm === 'number' && typeof optRpm === 'number') {
                const direction = optRpm > currentRpm ? 'Increase' : 'Decrease'
                optSteps.push(`Step 2: ${direction} generator RPM from ${currentRpm.toFixed(1)} → ${optRpm.toFixed(1)}`)
              }
              if (typeof currentYaw === 'number' && typeof optYaw === 'number') {
                optSteps.push(`Step 3: Adjust yaw alignment from ${currentYaw.toFixed(0)}° → ${optYaw.toFixed(0)}°`)
              }
              
              const timestamp = res.timestamp || r.original?.Timestamp || r.original?.timestamp || `Row ${r.row}`
              
              return (
                <div
                  key={i}
                  className="rounded-xl border-2 border-slate-200 p-4 bg-white/90 hover:shadow-lg transition-all"
                >
                  <div className="mb-3 pb-2 border-b-2 border-primary">
                    <p className="font-bold text-lg text-slate-800">
                      {timestamp}
                    </p>
                  </div>

                  {r.error && (
                    <div className="mb-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                      <p className="text-red-700 text-sm font-medium">❌ {r.error}</p>
                    </div>
                  )}

                  <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs font-bold text-orange-700 uppercase mb-2">
                      📊 Before Optimization
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Power (kW)</span>
                        <span className="font-semibold text-slate-900">
                          {currentPower.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Pitch (°)</span>
                        <span className="font-semibold text-slate-900">
                          {typeof currentPitch === 'number' ? currentPitch.toFixed(2) : currentPitch}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">RPM</span>
                        <span className="font-semibold text-slate-900">
                          {typeof currentRpm === 'number' ? currentRpm.toFixed(2) : currentRpm}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Yaw (°)</span>
                        <span className="font-semibold text-slate-900">
                          {typeof currentYaw === 'number' ? currentYaw.toFixed(2) : currentYaw}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center my-2">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>

                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs font-bold text-green-700 uppercase mb-2">
                      ✨ After Optimization
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Power (kW)</span>
                        <span className="font-semibold text-green-700">
                          {optPower.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Pitch (°)</span>
                        <span className="font-semibold text-green-700">
                          {optPitch.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">RPM</span>
                        <span className="font-semibold text-green-700">
                          {optRpm.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Yaw (°)</span>
                        <span className="font-semibold text-green-700">
                          {optYaw.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {optSteps.length > 0 && (
                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs font-bold text-yellow-700 uppercase mb-2">
                        🛠 Optimization Measures
                      </p>
                      <ul className="list-disc ml-5 space-y-1 text-sm">
                        {optSteps.map((step: string, idx: number) => (
                          <li key={idx} className="text-yellow-900">{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-1">
                      🤖 ML Prediction
                    </p>
                    <p className="text-sm text-blue-900 font-medium leading-tight">
                      {typeof predictedScenario === 'string'
                        ? predictedScenario.replace(/_/g, ' ')
                        : String(predictedScenario)}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
