"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsIcon, Bell, Palette, Database } from "lucide-react"

export function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    autoBackup: true,
    dataRetention: "30",
    updateFrequency: "5",
  })

  const handleToggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const settingsSections = [
    {
      title: "Notifications",
      icon: Bell,
      description: "Manage alert and notification preferences",
      settings: [
        { key: "notifications", label: "Enable Notifications", type: "toggle" },
        { key: "emailAlerts", label: "Email Alerts", type: "toggle" },
      ],
    },
    {
      title: "Display",
      icon: Palette,
      description: "Customize dashboard appearance",
      settings: [{ key: "darkMode", label: "Dark Mode", type: "toggle" }],
    },
    {
      title: "Data Management",
      icon: Database,
      description: "Configure data storage and retention",
      settings: [
        { key: "autoBackup", label: "Automatic Backups", type: "toggle" },
        { key: "dataRetention", label: "Data Retention (days)", type: "input" },
      ],
    },
    {
      title: "System",
      icon: SettingsIcon,
      description: "System-wide configuration",
      settings: [{ key: "updateFrequency", label: "Update Frequency (seconds)", type: "input" }],
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure system preferences and options</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, idx) => {
          const Icon = section.icon
          return (
            <Card key={idx} className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <Label htmlFor={setting.key} className="text-base cursor-pointer">
                      {setting.label}
                    </Label>
                    {setting.type === "toggle" ? (
                      <Switch
                        checked={settings[setting.key as keyof typeof settings] as boolean}
                        onCheckedChange={() => handleToggle(setting.key)}
                      />
                    ) : (
                      <Input
                        id={setting.key}
                        type="number"
                        value={settings[setting.key as keyof typeof settings]}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-24"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
        <Button variant="outline">Reset to Defaults</Button>
        <Button variant="outline" className="text-red-600 hover:bg-red-50 bg-transparent">
          Clear Cache
        </Button>
      </div>
    </div>
  )
}
