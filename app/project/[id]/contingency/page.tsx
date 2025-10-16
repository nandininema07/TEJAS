"use client"

import { useState } from "react"
import { useProcurement } from "@/components/project/procurement-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContingencyPage() {
  const { bufferMonths, consumeBuffer } = useProcurement()
  const [delay, setDelay] = useState<number>(1)

  const pct = Math.round((bufferMonths / 9) * 100)

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-xl md:text-2xl font-semibold">Contingency Tracker</h1>
        <p className="text-sm text-muted-foreground">Monitor buffer consumption and get early warnings.</p>
      </header>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-sm">Buffer Remaining</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-semibold">{bufferMonths} months</div>
          <div className="h-3 bg-muted rounded">
            <div className="h-3 bg-primary rounded" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs text-muted-foreground">Baseline buffer: 9 months</div>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-sm">Log Delay</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-[200px_160px]">
          <Input type="number" min={1} max={9} value={delay} onChange={(e) => setDelay(Number(e.target.value))} />
          <Button onClick={() => consumeBuffer(delay)}>Consume Buffer</Button>
          <div className="md:col-span-2 text-sm text-muted-foreground">
            Burn Rate Alert: {bufferMonths - delay < 3 ? "High risk — buffer < 3 months" : "Nominal"}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
