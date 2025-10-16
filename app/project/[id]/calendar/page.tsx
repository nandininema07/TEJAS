"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-xl md:text-2xl font-semibold">Calendar</h1>
        <p className="text-sm text-muted-foreground">View critical dates and deadlines.</p>
      </header>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-sm">Project Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          <div className="text-sm text-muted-foreground mt-3">
            Select a date to review events in the Events section.
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
