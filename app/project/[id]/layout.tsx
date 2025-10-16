"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import type { ReactNode } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ProcurementProvider, useProcurement } from "@/components/project/procurement-context"

const nav = [
  { label: "Dashboard", href: (id: string) => `/project/${id}/dashboard` },
  { label: "Inventory", href: (id: string) => `/project/${id}/inventory` },
  { label: "Map", href: (id: string) => `/project/${id}/map` },
  { label: "Contingency", href: (id: string) => `/project/${id}/contingency` },
  { label: "Events & Warnings", href: (id: string) => `/project/${id}/events` },
  { label: "Team", href: (id: string) => `/project/${id}/team` },
  { label: "Calendar", href: (id: string) => `/project/${id}/calendar` },
]

function ProjectShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { id } = useParams() as { id: string }
  const { list } = useProcurement()

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Project {id}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => {
                  const href = item.href(id)
                  const active = pathname?.startsWith(href)
                  return (
                    <SidebarMenuItem key={item.label}>
                      <Link
                        href={href}
                        className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60"}`}
                      >
                        <span>{item.label}</span>
                        {item.label === "Inventory" && list.length > 0 && (
                          <span className="text-xs bg-primary text-primary-foreground rounded px-2 py-0.5">
                            {list.length}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="px-3">
            <Button variant="outline" className="w-full bg-transparent" onClick={() => window.open("/", "_self")}>
              Back to Portfolio
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <section className="overflow-auto">{children}</section>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function ProjectLayout({ children }: { children: ReactNode }) {
  const { id } = useParams() as { id: string }
  return (
    <ProcurementProvider projectId={id}>
      <ProjectShell>{children}</ProjectShell>
    </ProcurementProvider>
  )
}
