"use client"

import { useState } from "react"
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
import { Upload, TrendingUp, Network, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

const PARAMETERS = [
  "timestamp",
  "wind_speed",
  "pitch",
  "rpm",
  "yaw",
  "temperature",
  "nacelle_temp",
  "gear_oil_temp",
  "generator_temp",
]

export default function DataInputPage() {
  const [csvData, setCsvData] = useState<any[]>([])
  const [selectedXAxis, setSelectedXAxis] = useState<string>("wind_speed")
  const [selectedYAxis, setSelectedYAxis] = useState<string>("rpm")
  const [selectedChartType, setSelectedChartType] = useState<string>("line")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    
    // Reset previous state when new file selected
    setCsvData([])
    setApiResponse(null)
  }

  // 🆕 Load Hugging Face Dataset
  const fetchHFData = async () => {
    setIsLoading(true)
    setCsvData([])
    setApiResponse(null)
    setSelectedFile(null)

    try {
      const res = await fetch(
        "https://datasets-server.huggingface.co/rows?dataset=vossmoos%2Fvestasv52-scada-windturbine-granada&config=default&split=train&offset=0&length=100"
      )
      
      if (!res.ok) throw new Error(`Failed to fetch HF dataset: ${res.status}`)
      
      const json = await res.json()
      const hfRows = json.rows.map((r: any) => r.row)
      
      // Transform HF data to match your parameter names
      const transformedData = hfRows.map((row: any) => ({
        timestamp: row.Timestamp || new Date().toISOString(),
        wind_speed: row.WindSpeed || 0,
        pitch: row.Pitch || 0,
        rpm: row.RotorRPM || 0,
        yaw: row.WindDirRel || 0,
        temperature: row.EnvirTemp || 0,
        nacelle_temp: row.NacelTemp || 0,
        gear_oil_temp: row.GearOilTemp || 0,
        generator_temp: row.GenTemp || 0,
      }))
      
      setCsvData(transformedData)
      console.log('✅ HF Dataset loaded:', transformedData.length, 'records')
    } catch (error) {
      console.error("❌ Error loading HF dataset:", error)
      setApiResponse({ error: "Failed to load Hugging Face dataset" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a CSV file first")

    // 🧹 Clear previous state
    setCsvData([])
    setApiResponse(null)
    setIsLoading(true)

    const formData = new FormData()
    formData.append("file", selectedFile)

    // 🕒 Add timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch("https://cypher-hackathon.onrender.com/predict", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      
      const data = await response.json()
      console.log('📥 API Response:', data)
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || `Server error: ${response.status}`)
      }

      // 🧼 CLEAN THE DATA: remove 'environment' everywhere
      if (Array.isArray(data.results)) {
        const cleanedResults = data.results.map((item: any) => {
          const { environment, ...rest } = item
          return {
            ...rest,
            telemetry: {
              ...Object.fromEntries(
                Object.entries(item.telemetry || {}).filter(
                  ([key]) => key !== "environment"
                )
              ),
            },
          }
        })
        setApiResponse({ ...data, results: cleanedResults })

        const flattened = cleanedResults.map((item: any) => ({
          timestamp: item.timestamp,
          ...item.telemetry,
        }))
        setCsvData(flattened)
      } else if (Array.isArray(data.predictions)) {
        setCsvData(data.predictions)
        setApiResponse(data)
      }
    } catch (err: any) {
      console.error('❌ Upload failed:', err)
      if (err.name === 'AbortError') {
        setApiResponse({ error: 'Request timeout - server took too long to respond' })
      } else {
        setApiResponse({ error: err.message })
      }
      alert(`Upload failed: ${err.message}`)
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    }
  }

  const renderChart = () => {
    if (csvData.length === 0)
      return (
        <div className="text-center text-muted-foreground py-10">
          Upload a CSV file or load HF dataset to visualize data.
        </div>
      )

    const chartProps = {
      data: csvData,
      margin: { top: 5, right: 30, left: 0, bottom: 5 },
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
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
          Data Analysis & Prediction
        </h1>
        <p className="text-muted-foreground">
          Upload a CSV file, load HF turbine data, or visualize and get ML-based optimization results.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* CSV Upload */}
        <Card className="lg:col-span-1 shadow-lg border border-slate-200 backdrop-blur-sm bg-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Upload className="w-5 h-5 text-primary" /> Data Input
            </CardTitle>
            <CardDescription>Upload CSV or load sample turbine data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
              className="w-full flex items-center gap-2 font-medium"
            >
              <Network className="w-4 h-4" />
              {isLoading ? "Uploading..." : "Upload & Predict"}
            </Button>
            
            {/* 🆕 HF Dataset Button */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/60 px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <Button
              onClick={fetchHFData}
              disabled={isLoading}
              variant="outline"
              className="w-full flex items-center gap-2 font-medium"
            >
              <Database className="w-4 h-4" />
              {isLoading ? "Loading..." : "Load HF Dataset"}
            </Button>
            
            {csvData.length > 0 && (
              <p className="text-sm text-green-600 font-medium">
                ✓ {csvData.length} records loaded
              </p>
            )}
          </CardContent>
        </Card>

        {/* Visualization Settings */}
        <Card className="lg:col-span-2 shadow-lg border border-slate-200 backdrop-blur-sm bg-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="w-5 h-5 text-primary" /> Visualization Settings
            </CardTitle>
            <CardDescription>Select chart parameters and type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">X-Axis</label>
                <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select X-axis" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARAMETERS.map((param) => (
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
                    {PARAMETERS.map((param) => (
                      <SelectItem key={param} value={param}>
                        {param}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Chart Type</label>
                <Select
                  value={selectedChartType}
                  onValueChange={setSelectedChartType}
                >
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-lg border border-slate-200 backdrop-blur-sm bg-white/60">
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>
            {csvData.length > 0
              ? "Uploaded dataset visualization"
              : "Upload a CSV file or load HF dataset to view data"}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>

      {/* Error Display */}
      {apiResponse?.error && (
        <Card className="border-red-200 bg-red-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              ⚠️ Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 text-sm">{apiResponse.error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Check console for more details or try a different file.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results (Environment Removed) */}
      {apiResponse?.results && !apiResponse.error && (
        <Card className="shadow-lg border border-slate-200 backdrop-blur-sm bg-white/60">
          <CardHeader>
            <CardTitle>Optimization Results</CardTitle>
            <CardDescription>AI-generated turbine telemetry predictions</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {apiResponse.results.map((r: any, i: number) => (
              <div
                key={i}
                className="rounded-xl border p-4 bg-white/80 hover:shadow-md transition-all"
              >
                <p className="font-semibold text-slate-800">
                  Timestamp: {r.timestamp}
                </p>
                {r.summary && (
                  <p className="italic text-sm text-muted-foreground mb-2">
                    {r.summary}
                  </p>
                )}
                {r.telemetry &&
                  Object.entries(r.telemetry)
                    .filter(([key]) => key !== "environment")
                    .map(([key, val]) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm border-b border-slate-100 py-1"
                      >
                        <span className="text-slate-500">
                          {key.replaceAll("_", " ")}
                        </span>
                        <span className="text-slate-800 font-medium">
                          {String(val)}
                        </span>
                      </div>
                    ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
