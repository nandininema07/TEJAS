"use client"

import Link from "next/link"
import { Suspense, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

type ProjectStatus = "Predicted" | "On Track" | "At Risk" | "Delayed" | "Completed"
type Project = {
  id: string
  name: string
  status: ProjectStatus
  plannedStart: string
  plannedEnd: string
  budgetCr: number
}

function getStatusBadge(status: ProjectStatus) {
  const variant =
    status === "On Track"
      ? "default"
      : status === "At Risk"
        ? "secondary"
        : status === "Delayed"
          ? "destructive"
          : status === "Predicted"
            ? "outline"
            : "outline"
  return <Badge variant={variant}>{status}</Badge>
}

const mockProjects: Project[] = [
  {
    id: "PG-2201",
    name: "Northern Corridor 400kV Upgrade",
    status: "On Track",
    plannedStart: "2025-01-10",
    plannedEnd: "2026-10-01",
    budgetCr: 1240,
  },
  {
    id: "PG-2202",
    name: "Coastal Interconnect Line E-W",
    status: "At Risk",
    plannedStart: "2025-03-01",
    plannedEnd: "2026-12-15",
    budgetCr: 860,
  },
  {
    id: "PG-2203",
    name: "Smart Substation Retrofit Phase I",
    status: "Delayed",
    plannedStart: "2024-08-01",
    plannedEnd: "2025-12-31",
    budgetCr: 420,
  },
  {
    id: "AI-1001",
    name: "PIB: Eastern Loop Expansion",
    status: "Predicted",
    plannedStart: "2025-07-01",
    plannedEnd: "2027-04-30",
    budgetCr: 980,
  },
  {
    id: "AI-1002",
    name: "Media: HVDC Backbone South",
    status: "Predicted",
    plannedStart: "2026-01-15",
    plannedEnd: "2028-03-01",
    budgetCr: 1650,
  },
  {
    id: "PG-2107",
    name: "River Delta Reinforcement",
    status: "Completed",
    plannedStart: "2023-01-01",
    plannedEnd: "2024-06-15",
    budgetCr: 300,
  },
]

function PortfolioContent() {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<"all" | "predicted" | "active" | "completed">("all")

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return mockProjects.filter((p) => {
      const matchesQ = !q || [p.name, p.id, p.status].join(" ").toLowerCase().includes(q)
      const matchesTab =
        tab === "all"
          ? true
          : tab === "predicted"
            ? p.status === "Predicted"
            : tab === "completed"
              ? p.status === "Completed"
              : // active bucket: On Track / At Risk / Delayed
                ["On Track", "At Risk", "Delayed"].includes(p.status)
      return matchesQ && matchesTab
    })
  }, [query, tab])

  const predicted = filtered.filter((p) => p.status === "Predicted")
  const active = filtered.filter((p) => ["On Track", "At Risk", "Delayed"].includes(p.status))
  const completed = filtered.filter((p) => p.status === "Completed")

  return (
    <main className="px-6 py-8 max-w-7xl mx-auto">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-pretty">Project Portfolio</h1>
          <p className="text-muted-foreground">A central hub to oversee all projects and start new ones.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search projects by name, ID, or status"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
          <CreateProjectDialog />
        </div>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="predicted">AI-Predicted</TabsTrigger>
          <TabsTrigger value="active">Active/Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <section aria-labelledby="predicted" className="mt-6">
        <div className="flex items-center justify-between">
          <h2 id="predicted" className="text-lg font-medium">
            AI-Predicted
          </h2>
          <span className="text-sm text-muted-foreground">{predicted.length} projects</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-3">
          {predicted.map((p) => (
            <ProjectCard key={p.id} project={p} predicted />
          ))}
          {predicted.length === 0 && <EmptyState label="No predicted projects match your filters." />}
        </div>
      </section>

      <Separator className="my-8" />

      <section aria-labelledby="active" className="mt-6">
        <div className="flex items-center justify-between">
          <h2 id="active" className="text-lg font-medium">
            Active / Ongoing
          </h2>
          <span className="text-sm text-muted-foreground">{active.length} projects</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-3">
          {active.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
          {active.length === 0 && <EmptyState label="No active projects match your filters." />}
        </div>
      </section>

      <Separator className="my-8" />

      <section aria-labelledby="completed" className="mt-6">
        <div className="flex items-center justify-between">
          <h2 id="completed" className="text-lg font-medium">
            Completed / Archived
          </h2>
          <span className="text-sm text-muted-foreground">{completed.length} projects</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-3">
          {completed.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
          {completed.length === 0 && <EmptyState label="No completed projects match your filters." />}
        </div>
      </section>
    </main>
  )
}

function CreateProjectDialog() {
  // Keeping UX simple: create a random ID and navigate to workspace
  function handleCreate() {
    const id = "NEW-" + Math.floor(Math.random() * 10000).toString()
    window.open(`/project/${id}/dashboard`, "_blank", "noopener,noreferrer")
  }
  return <Button onClick={handleCreate}>Create New Project</Button>
}

function ProjectCard({ project, predicted }: { project: Project; predicted?: boolean }) {
  const href = `/project/${project.id}/dashboard`
  return (
    <Card className="transition hover:shadow-md focus-within:ring-2 ring-ring rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{project.name}</CardTitle>
        {getStatusBadge(project.status)}
      </CardHeader>
      <CardContent className="text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-muted-foreground">Project ID</span>
            <div className="font-medium">{project.id}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Budget</span>
            <div className="font-medium">₹ {project.budgetCr} Cr</div>
          </div>
          <div>
            <span className="text-muted-foreground">Planned Start</span>
            <div className="font-medium">{project.plannedStart}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Planned End</span>
            <div className="font-medium">{project.plannedEnd}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Link href={href} target="_blank" className="w-full">
            <Button className="w-full">Open Workspace</Button>
          </Link>
          {predicted && (
            <Button variant="secondary" onClick={() => window.open(`/project/${project.id}/inventory`, "_blank")}>
              Begin Project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ label }: { label: string }) {
  return <div className="text-sm text-muted-foreground border rounded-md p-6 text-center">{label}</div>
}

export default function Page() {
  return (
    <Suspense>
      <PortfolioContent />
    </Suspense>
  )
}
