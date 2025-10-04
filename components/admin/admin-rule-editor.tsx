"use client"

import * as React from "react"

type User = { id: string; name: string; email?: string; role?: "admin" | "employee" | "manager" }
type Approver = { id: string; name: string; required: boolean }

type RuleState = {
  user?: string
  description: string
  managerId?: string
  isManagerApprover: boolean
  approvers: Approver[]
  sequence: boolean
  minApprovalPercent: number
}

function loadUsers(): User[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem("users")
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as User[]
  } catch {}
  return []
}

function loadRule(): RuleState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem("approval_rules_blueprint")
    if (!raw) return null
    return JSON.parse(raw) as RuleState
  } catch {}
  return null
}

export default function AdminRuleEditor() {
  const users = loadUsers()
  const managers = users.filter((u) => u.role === "manager")
  const [state, setState] = React.useState<RuleState>(() => {
    return (
      loadRule() ?? {
        user: users[0]?.name ?? "",
        description: "",
        managerId: managers[0]?.id,
        isManagerApprover: false,
        approvers: users
          .filter((u) => u.role !== "admin")
          .slice(0, 3)
          .map((u) => ({ id: u.id, name: u.name, required: false })),
        sequence: false,
        minApprovalPercent: 60,
      }
    )
  })

  function save() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("approval_rules_blueprint", JSON.stringify(state))
    }
  }

  return (
    <section className="space-y-6">
      {/* Top line: User (context) */}
      <div>
        <label className="block text-sm font-medium mb-1">User</label>
        <input
          className="w-full rounded-md border border-border bg-background p-2"
          value={state.user ?? ""}
          onChange={(e) => setState((s) => ({ ...s, user: e.target.value }))}
          placeholder="marc"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description about rules</label>
        <input
          className="w-full rounded-md border border-border bg-background p-2"
          value={state.description}
          onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))}
          placeholder="Approval rule for miscellaneous expenses"
        />
      </div>

      {/* Manager dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">Manager</label>
        {managers.length > 0 ? (
          <select
            className="w-full rounded-md border border-border bg-background p-2"
            value={state.managerId ?? ""}
            onChange={(e) => setState((s) => ({ ...s, managerId: e.target.value }))}
          >
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="w-full rounded-md border border-border bg-background p-2"
            placeholder="Manager name"
            onChange={(e) => setState((s) => ({ ...s, managerId: e.target.value }))}
          />
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Dynamic dropdown: initial manager from user record; admin can change for approval if required.
        </p>
      </div>

      {/* Approvers header, Manager as approver toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Approvers</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.isManagerApprover}
            onChange={(e) => setState((s) => ({ ...s, isManagerApprover: e.target.checked }))}
          />
          <span>Is manager an approver?</span>
        </label>
      </div>

      {/* Approvers list with Required */}
      <div className="space-y-3">
        {state.approvers.map((a, idx) => (
          <div key={a.id ?? idx} className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-8">
              <input
                className="w-full rounded-md border border-border bg-background p-2"
                value={a.name}
                onChange={(e) => {
                  const name = e.target.value
                  setState((s) => {
                    const arr = [...s.approvers]
                    arr[idx] = { ...arr[idx], name }
                    return { ...s, approvers: arr }
                  })
                }}
                placeholder={`Approver ${idx + 1}`}
              />
            </div>
            <div className="col-span-4 flex items-center justify-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={a.required}
                  onChange={(e) => {
                    const required = e.target.checked
                    setState((s) => {
                      const arr = [...s.approvers]
                      arr[idx] = { ...arr[idx], required }
                      return { ...s, approvers: arr }
                    })
                  }}
                />
                Required
              </label>
              <button
                type="button"
                className="rounded-md border border-border px-2 py-1 text-xs"
                onClick={() => setState((s) => ({ ...s, approvers: s.approvers.filter((_, i) => i !== idx) }))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-1 text-sm"
            onClick={() =>
              setState((s) => ({
                ...s,
                approvers: [...s.approvers, { id: crypto.randomUUID(), name: "", required: false }],
              }))
            }
          >
            Add Approver
          </button>
        </div>
      </div>

      {/* Approvers Sequence toggle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Approvers Sequence</div>
          <p className="text-xs text-muted-foreground mt-1 max-w-prose">
            If checked, requests go in the listed order (one by one). If unchecked, send to all approvers at the same
            time. If a required approver rejects, the request is auto-rejected.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.sequence}
            onChange={(e) => setState((s) => ({ ...s, sequence: e.target.checked }))}
          />
          Sequence
        </label>
      </div>

      {/* Minimum approval percentage */}
      <div className="grid grid-cols-12 items-center gap-3">
        <label className="col-span-6 text-sm font-medium">Minimum Approval percentage</label>
        <div className="col-span-6 flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={100}
            className="w-24 rounded-md border border-border bg-background p-2 text-right"
            value={state.minApprovalPercent}
            onChange={(e) => setState((s) => ({ ...s, minApprovalPercent: Number(e.target.value || 0) }))}
          />
          <span className="text-sm">%</span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="rounded-md border border-border px-4 py-2 text-sm"
          onClick={() => setState(loadRule() ?? state)}
        >
          Reset
        </button>
        <button type="button" className="rounded-md bg-foreground/90 px-4 py-2 text-sm text-background" onClick={save}>
          Save Rules
        </button>
      </div>
    </section>
  )
}
