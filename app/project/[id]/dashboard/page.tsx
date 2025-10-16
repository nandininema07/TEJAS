"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProcurement } from "@/components/project/procurement-context"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { list, paused } = useProcurement()

  const kpis = [
    { label: "Budget vs Actual", value: "₹ 820 Cr / 1240 Cr", trend: "+1.8%" },
    { label: "Contingency Remaining", value: "9 mo", trend: "Stable" },
    { label: "Upcoming Milestones", value: "3 within 30 days", trend: "" },
  ]

  const alerts = [
    { id: 1, type: "Reorder", msg: "Steel Angle 90x90x8 will exhaust by 2025-10-05", severity: "High" },
    { id: 2, type: "Deadline", msg: "Vendor RFQ for Tower Bolts due in 7 days", severity: "Medium" },
    { id: 3, type: "Risk", msg: "Monsoon impact expected: adjust foundation schedule", severity: "Low" },
  ]

  const phases = [
    { name: "Foundation & Civil Works", start: 0, duration: 4 },
    { name: "Tower Erection", start: 4, duration: 5 },
    { name: "Stringing & Commissioning", start: 9, duration: 4 },
  ]

  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-semibold">Project Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Procurement List Items: <Badge variant="secondary">{list.length}</Badge>{" "}
          {paused && <Badge className="ml-2">Paused</Badge>}
        </div>
      </div>

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <Card key={k.label} className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{k.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">{k.value}</div>
              {k.trend && <div className="text-xs text-muted-foreground mt-1">{k.trend}</div>}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-lg">
          <CardHeader>
            <CardTitle className="text-sm">Project Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {phases.map((p, idx) => (
                <div key={idx}>
                  <div className="text-xs text-muted-foreground mb-1">{p.name}</div>
                  <div className="h-3 bg-muted rounded">
                    <div
                      className="h-3 bg-primary rounded"
                      style={{ width: `${(p.duration / 13) * 100}%`, marginLeft: `${(p.start / 13) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="text-xs text-muted-foreground">Timeline: 0 → 13 months</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-sm">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="text-sm">
                <div className="font-medium">
                  {a.type} <span className="text-muted-foreground">({a.severity})</span>
                </div>
                <div className="text-muted-foreground">{a.msg}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
