"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Clock, Wrench } from "lucide-react"

export function Maintenance() {
  const [maintenanceItems] = useState([
    {
      id: 1,
      title: "Oil Change - Gearbox",
      description: "Scheduled gearbox oil replacement",
      status: "scheduled",
      dueDate: "2025-11-15",
      priority: "high",
      estimatedTime: "4 hours",
    },
    {
      id: 2,
      title: "Blade Inspection",
      description: "Visual inspection of rotor blades for damage",
      status: "completed",
      completedDate: "2025-10-20",
      priority: "medium",
      estimatedTime: "6 hours",
    },
    {
      id: 3,
      title: "Bearing Lubrication",
      description: "Lubricate main shaft and generator bearings",
      status: "in-progress",
      startDate: "2025-10-22",
      priority: "high",
      estimatedTime: "2 hours",
    },
    {
      id: 4,
      title: "Electrical System Check",
      description: "Full electrical system diagnostics",
      status: "scheduled",
      dueDate: "2025-11-30",
      priority: "medium",
      estimatedTime: "3 hours",
    },
    {
      id: 5,
      title: "Pitch System Calibration",
      description: "Calibrate pitch control system",
      status: "scheduled",
      dueDate: "2025-12-10",
      priority: "low",
      estimatedTime: "2 hours",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "scheduled":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <Wrench className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      "in-progress": "secondary",
      scheduled: "destructive",
    }
    return variants[status] || "outline"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Maintenance</h1>
        <p className="text-muted-foreground">Schedule and track maintenance tasks</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">3</p>
              <p className="text-sm text-muted-foreground mt-1">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">1</p>
              <p className="text-sm text-muted-foreground mt-1">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">1</p>
              <p className="text-sm text-muted-foreground mt-1">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">17</p>
              <p className="text-sm text-muted-foreground mt-1">Total Hours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance List */}
      <div className="space-y-4">
        {maintenanceItems.map((item) => (
          <Card key={item.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {getStatusIcon(item.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <Badge variant={getStatusBadge(item.status)} className="capitalize">
                        {item.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Due: </span>
                        <span className="font-medium">{item.dueDate || item.completedDate || item.startDate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Time: </span>
                        <span className="font-medium">{item.estimatedTime}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Priority: </span>
                        <span className={`font-medium capitalize ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
