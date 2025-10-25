export function generateMockData() {
  return {
    windSpeed: 12.5 + Math.random() * 5,
    maxWindSpeed: 18,
    minWindSpeed: 2,
    power: 450 + Math.random() * 100,
    maxPower: 600,
    minPower: 50,
    pitch: 25 + Math.random() * 10,
    rotorRPM: 11.5 + Math.random() * 1,
    genRPM: 1500 + Math.random() * 100,
    nacelTemp: 35 + Math.random() * 10,
    gearOilTemp: 45 + Math.random() * 15,
    genTemp: 40 + Math.random() * 12,
    genBearTemp: 38 + Math.random() * 8,
    environTemp: 15 + Math.random() * 10,
    status: ["Active", "Idle", "Maintenance"][Math.floor(Math.random() * 3)],
  }
}

export function generateChartData(timeRange: string) {
  const points = timeRange === "1h" ? 60 : timeRange === "24h" ? 24 : timeRange === "7d" ? 7 : 30
  const data = []

  for (let i = 0; i < points; i++) {
    const baseWindSpeed = 10 + Math.sin((i / points) * Math.PI * 2) * 5
    const basePower = 400 + Math.cos((i / points) * Math.PI * 2) * 150

    data.push({
      time: formatTime(i, timeRange),
      windSpeed: baseWindSpeed + (Math.random() - 0.5) * 2,
      power: Math.max(50, basePower + (Math.random() - 0.5) * 50),
      pitch: 20 + Math.sin((i / points) * Math.PI) * 15,
      rotorRPM: 11 + Math.cos((i / points) * Math.PI * 2) * 1.5,
      nacelTemp: 35 + Math.sin((i / points) * Math.PI * 2) * 8,
      genTemp: 40 + Math.cos((i / points) * Math.PI * 2) * 10,
      gearOilTemp: 45 + Math.sin((i / points) * Math.PI * 2) * 12,
    })
  }

  return data
}

function formatTime(index: number, timeRange: string): string {
  if (timeRange === "1h") {
    return `${index}:00`
  } else if (timeRange === "24h") {
    return `${index}:00`
  } else if (timeRange === "7d") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days[index % 7]
  } else {
    return `Day ${index + 1}`
  }
}
