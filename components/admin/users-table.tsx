"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  addUser,
  getAllUsers,
  updateUserRole,
  setManagerForUser,
  getSessionUser,
  setRandomPassword,
} from "@/lib/client-store"

export function UsersTable() {
  const { data: users, mutate } = useSWR("users", getAllUsers)
  const me = getSessionUser()
  const [invite, setInvite] = useState({ name: "", email: "", role: "employee" as "employee" | "manager" | "admin" })

  const onInvite = () => {
    if (!invite.email || !invite.name) return
    addUser({ name: invite.name, email: invite.email, role: invite.role })
    mutate()
    setInvite({ name: "", email: "", role: "employee" })
  }

  return (
    <div className="grid gap-6">
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="grid gap-1">
            <Label>Name</Label>
            <Input value={invite.name} onChange={(e) => setInvite((i) => ({ ...i, name: e.target.value }))} />
          </div>
          <div className="grid gap-1">
            <Label>Email</Label>
            <Input
              type="email"
              value={invite.email}
              onChange={(e) => setInvite((i) => ({ ...i, email: e.target.value }))}
            />
          </div>
          <div className="grid gap-1">
            <Label>Role</Label>
            <select
              className="h-10 rounded-md border bg-background px-3"
              value={invite.role}
              onChange={(e) => setInvite((i) => ({ ...i, role: e.target.value as any }))}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={onInvite} className="w-full">
              Add User
            </Button>
          </div>
        </div>
      </Card>

      <div className="overflow-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Manager</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    className="h-9 rounded-md border bg-background px-2"
                    value={u.role}
                    onChange={(e) => {
                      updateUserRole(u.id, e.target.value as any)
                      mutate()
                    }}
                    disabled={me?.id === u.id}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <ManagerPicker userId={u.id} selectedId={u.managerId || ""} />
                </td>
                <td className="p-3">
                  <SendPasswordButton userId={u.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ManagerPicker({ userId, selectedId }: { userId: string; selectedId?: string }) {
  const { data: users, mutate } = useSWR("users", getAllUsers)
  const managers = users?.filter((u) => u.role === "manager") || []

  return (
    <select
      className="h-9 rounded-md border bg-background px-2"
      value={selectedId || ""}
      onChange={(e) => {
        setManagerForUser(userId, e.target.value || undefined)
        mutate()
      }}
    >
      <option value="">None</option>
      {managers.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </select>
  )
}

function SendPasswordButton({ userId }: { userId: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        const pwd = setRandomPassword(userId)
        if (pwd) alert(`Temporary password: ${pwd}`)
      }}
    >
      Send password
    </Button>
  )
}
