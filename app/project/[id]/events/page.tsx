"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type EventItem = { id: number; when: string; msg: string }

export default function EventsPage() {
  const [items, setItems] = useState<EventItem[]>([
    { id: 1, when: "2025-10-01", msg: "RFQ review meeting" },
    { id: 2, when: "2025-10-10", msg: "Foundation phase handover" },
  ])
  const [when, setWhen] = useState("")
  const [msg, setMsg] = useState("")

  function add() {
    if (!when || !msg) return
    setItems((prev) => [...prev, { id: prev.length + 1, when, msg }])
    setWhen("")
    setMsg("")
  }

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-xl md:text-2xl font-semibold">Events & Warnings</h1>
        <p className="text-sm text-muted-foreground">System and manual events for this project.</p>
      </header>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-sm">Add Event</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-[200px_1fr_160px]">
          <Input type="date" value={when} onChange={(e) => setWhen(e.target.value)} />
          <Input placeholder="Description" value={msg} onChange={(e) => setMsg(e.target.value)} />
          <Button onClick={add}>Add</Button>
        </CardContent>
      </Card>

      <section className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id} className="rounded-lg">
            <CardContent className="py-4 text-sm">
              <span className="font-medium mr-2">{item.when}</span>
              <span className="text-muted-foreground">{item.msg}</span>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}
