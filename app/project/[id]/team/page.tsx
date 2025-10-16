"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Member = { id: number; name: string; role: string; email: string }

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "A. Sharma", role: "Project Manager", email: "asharma@example.com" },
    { id: 2, name: "K. Iyer", role: "Procurement Lead", email: "kiyer@example.com" },
    { id: 3, name: "R. Singh", role: "Site Engineer", email: "rsingh@example.com" },
  ])
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")

  function add() {
    if (!name || !role || !email) return
    setMembers((prev) => [...prev, { id: prev.length + 1, name, role, email }])
    setName("")
    setRole("")
    setEmail("")
  }
  function remove(id: number) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-xl md:text-2xl font-semibold">Project Team</h1>
        <p className="text-sm text-muted-foreground">Manage team members and roles.</p>
      </header>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-sm">Add Member</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-4">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={add}>Add</Button>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-sm">Members</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.role}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm" onClick={() => remove(m.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
