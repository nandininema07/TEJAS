"use client"

import { useMemo, useState } from "react"
import { useProcurement } from "@/components/project/procurement-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function MapPage() {
  const { list, materials, vendors, projectLocation } = useProcurement()
  const [selected, setSelected] = useState<string>("")

  const options = useMemo(() => {
    const ids = Array.from(new Set(list.map((l) => l.materialId)))
    return ids.map((id) => {
      const name = materials.find((m) => m.id === id)?.name || id
      return { id, name }
    })
  }, [list, materials])

  const candidates = useMemo(() => {
    if (!selected) return []
    return vendors
      .filter((v) => v.materials.includes(selected))
      .map((v) => ({ ...v, distance: haversine(projectLocation.lat, projectLocation.lon, v.lat, v.lon) }))
      .sort((a, b) => a.distance - b.distance)
  }, [selected, vendors, projectLocation])

  const best = candidates[0]

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-xl md:text-2xl font-semibold">Vendor Map & Recommendation</h1>
        <p className="text-sm text-muted-foreground">
          Select a material from your Procurement List to see recommended vendors.
        </p>
      </header>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-sm">Material Selection</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3 md:items-center">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="md:w-80">
              <SelectValue placeholder="Choose material" />
            </SelectTrigger>
            <SelectContent>
              {options.length === 0 && (
                <div className="px-2 py-1 text-sm text-muted-foreground">Procurement list is empty</div>
              )}
              {options.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.id} — {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {best && (
            <Badge className="w-fit">
              Recommended: {best.name} ({best.distance.toFixed(1)} km)
            </Badge>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {candidates.map((v) => (
          <Card key={v.id} className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-sm">{v.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="text-muted-foreground mb-2">Distance: {v.distance.toFixed(1)} km</div>
              <div className="text-xs text-muted-foreground">Supplies: {v.materials.join(", ")}</div>
              {best?.id === v.id && (
                <div className="mt-2 text-xs px-2 py-1 rounded bg-primary text-primary-foreground w-fit">
                  Quickest Vendor
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {selected && candidates.length === 0 && (
          <div className="text-sm text-muted-foreground border rounded-md p-6 text-center">
            No vendors found for selected material.
          </div>
        )}
        {!selected && (
          <div className="text-sm text-muted-foreground border rounded-md p-6 text-center">
            Choose a material to view vendors.
          </div>
        )}
      </section>
    </main>
  )
}
