"use client"

import { useMemo, useState } from "react"
import { useProcurement } from "@/components/project/procurement-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function InventoryPage() {
  const { materials, addToList, list, removeFromList } = useProcurement()
  const [phase, setPhase] = useState<string>("all")
  const [urgency, setUrgency] = useState<string>("all")
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const qq = q.toLowerCase()
    return materials.filter((m) => {
      const f1 = phase === "all" || m.phase === phase
      const f2 = urgency === "all" || m.urgency === urgency
      const f3 = !q || [m.id, m.name].join(" ").toLowerCase().includes(qq)
      return f1 && f2 && f3
    })
  }, [materials, phase, urgency, q])

  const totalEstimate = list.reduce((sum, li) => {
    const mat = materials.find((m) => m.id === li.materialId)
    return sum + (mat ? mat.unitCost * li.qty : 0)
  }, 0)

  return (
    <main className="p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-semibold">Inventory</h1>
        <div className="text-sm text-muted-foreground">Procurement List: {list.length} items</div>
      </header>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Search material..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={phase} onValueChange={setPhase}>
            <SelectTrigger>
              <SelectValue placeholder="Phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              <SelectItem value="Foundation">Foundation</SelectItem>
              <SelectItem value="Tower Erection">Tower Erection</SelectItem>
              <SelectItem value="Stringing">Stringing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger>
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Critical">Critically Required</SelectItem>
              <SelectItem value="Next Phase">Next Phase Procurement</SelectItem>
              <SelectItem value="Long Term">Long-Term Planning</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPhase("all")
                setUrgency("all")
                setQ("")
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-sm">Materials</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Forecast & Required</TableHead>
                <TableHead>On-Site</TableHead>
                <TableHead>Exhaustion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => {
                const status =
                  m.urgency === "Critical"
                    ? "Reorder Now"
                    : m.urgency === "Next Phase"
                      ? "Plan Next Phase"
                      : "Long Term"
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {m.id} • {m.phase}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">Forecast: {m.forecastQty.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Required by {m.requiredBy}</div>
                    </TableCell>
                    <TableCell>{m.onSite.toLocaleString()}</TableCell>
                    <TableCell>{m.predictedExhaustion}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded ${m.urgency === "Critical" ? "bg-destructive text-destructive-foreground" : "bg-muted"}`}
                      >
                        {status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => addToList({ materialId: m.id, qty: 1 })}>
                          Add to Procurement
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addToList({ materialId: m.id, qty: 10 })}>
                          +10
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => removeFromList(m.id)}>
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-sm">On-site Usage Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">Record daily consumption to keep forecasts fresh.</div>
            <UsageForm />
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-sm">Price Tracker (Procurement List)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">₹ {totalEstimate.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">
              Estimated against budget. Adjust quantities in Inventory.
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function UsageForm() {
  const [mat, setMat] = useState("")
  const [qty, setQty] = useState<number>(0)
  function submit() {
    console.log("[v0] Usage logged:", { mat, qty })
    alert("Usage logged")
    setMat("")
    setQty(0)
  }
  return (
    <div className="grid gap-2 md:grid-cols-3">
      <Input placeholder="Material ID (e.g., STL-ANG-90)" value={mat} onChange={(e) => setMat(e.target.value)} />
      <Input placeholder="Quantity used" type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
      <Button onClick={submit}>Log Usage</Button>
    </div>
  )
}
