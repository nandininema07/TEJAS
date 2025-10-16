"use client"

import type React from "react"

import { createContext, useContext, useMemo, useState } from "react"

export type MaterialRow = {
  id: string
  name: string
  phase: "Foundation" | "Tower Erection" | "Stringing"
  urgency: "Critical" | "Next Phase" | "Long Term"
  forecastQty: number
  requiredBy: string
  onSite: number
  predictedExhaustion: string
  unitCost: number
}

export type ProcurementItem = { materialId: string; qty: number }

type Vendor = {
  id: string
  name: string
  lat: number
  lon: number
  materials: string[]
}

type Ctx = {
  list: ProcurementItem[]
  addToList: (item: ProcurementItem) => void
  removeFromList: (materialId: string) => void
  clearList: () => void
  paused: boolean
  togglePaused: () => void
  materials: MaterialRow[]
  vendors: Vendor[]
  projectLocation: { lat: number; lon: number }
  bufferMonths: number
  consumeBuffer: (months: number) => void
}

const ProcurementCtx = createContext<Ctx | null>(null)

export function ProcurementProvider({ children, projectId }: { children: React.ReactNode; projectId: string }) {
  const [list, setList] = useState<ProcurementItem[]>([])
  const [paused, setPaused] = useState(false)
  const [bufferMonths, setBuffer] = useState(9)

  const materials: MaterialRow[] = useMemo(
    () => [
      {
        id: "STL-ANG-90",
        name: "Steel Angle 90x90x8",
        phase: "Foundation",
        urgency: "Critical",
        forecastQty: 800,
        requiredBy: "2025-11-01",
        onSite: 120,
        predictedExhaustion: "2025-10-05",
        unitCost: 5200,
      },
      {
        id: "CEM-OPC-53",
        name: "OPC Cement 53 Grade (bags)",
        phase: "Foundation",
        urgency: "Next Phase",
        forecastQty: 5000,
        requiredBy: "2025-12-01",
        onSite: 1200,
        predictedExhaustion: "2025-11-20",
        unitCost: 390,
      },
      {
        id: "COND-ACSR",
        name: "ACSR Conductor (km)",
        phase: "Stringing",
        urgency: "Long Term",
        forecastQty: 120,
        requiredBy: "2026-02-01",
        onSite: 20,
        predictedExhaustion: "2026-01-10",
        unitCost: 950000,
      },
      {
        id: "FND-REB-12",
        name: "Rebar T12 (tons)",
        phase: "Foundation",
        urgency: "Critical",
        forecastQty: 60,
        requiredBy: "2025-10-20",
        onSite: 10,
        predictedExhaustion: "2025-10-01",
        unitCost: 62000,
      },
      {
        id: "TWR-BLT-M20",
        name: "Tower Bolts M20 (pcs)",
        phase: "Tower Erection",
        urgency: "Next Phase",
        forecastQty: 25000,
        requiredBy: "2025-12-15",
        onSite: 4000,
        predictedExhaustion: "2025-12-01",
        unitCost: 28,
      },
    ],
    [],
  )

  const vendors: Vendor[] = useMemo(
    () => [
      { id: "V001", name: "Bharat Steel Works", lat: 28.6448, lon: 77.2167, materials: ["STL-ANG-90", "FND-REB-12"] },
      { id: "V002", name: "Eastern Cement Co", lat: 22.5726, lon: 88.3639, materials: ["CEM-OPC-53"] },
      { id: "V003", name: "SouthGrid Conductors", lat: 12.9716, lon: 77.5946, materials: ["COND-ACSR"] },
      { id: "V004", name: "Unified Fasteners Ltd", lat: 19.076, lon: 72.8777, materials: ["TWR-BLT-M20"] },
      {
        id: "V005",
        name: "Omni Infra Supplies",
        lat: 25.5941,
        lon: 85.1376,
        materials: ["CEM-OPC-53", "STL-ANG-90", "FND-REB-12"],
      },
    ],
    [],
  )

  // mock some project-based coords (hash on projectId)
  const projectLocation = useMemo(() => {
    const seed = projectId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    // clamp to broad India bbox
    const lat = 8 + (seed % 23) // 8..31
    const lon = 68 + (seed % 29) // 68..97
    return { lat, lon }
  }, [projectId])

  function addToList(item: ProcurementItem) {
    setList((prev) => {
      const existing = prev.find((p) => p.materialId === item.materialId)
      if (existing) {
        return prev.map((p) => (p.materialId === item.materialId ? { ...p, qty: p.qty + item.qty } : p))
      }
      return [...prev, item]
    })
  }
  function removeFromList(materialId: string) {
    setList((prev) => prev.filter((p) => p.materialId !== materialId))
  }
  function clearList() {
    setList([])
  }

  function togglePaused() {
    setPaused((p) => !p)
  }
  function consumeBuffer(months: number) {
    setBuffer((b) => Math.max(0, b - months))
  }

  const value: Ctx = {
    list,
    addToList,
    removeFromList,
    clearList,
    paused,
    togglePaused,
    materials,
    vendors,
    projectLocation,
    bufferMonths,
    consumeBuffer,
  }
  return <ProcurementCtx.Provider value={value}>{children}</ProcurementCtx.Provider>
}

export function useProcurement() {
  const ctx = useContext(ProcurementCtx)
  if (!ctx) throw new Error("useProcurement must be used within ProcurementProvider")
  return ctx
}
