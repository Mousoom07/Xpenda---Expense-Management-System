"use client"

import useSWR from "swr"
import { getRules, saveRules, getAllUsers } from "@/lib/client-store"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function RulesForm() {
  const { data: rules, mutate } = useSWR("rules", getRules)
  const { data: users } = useSWR("users", getAllUsers)
  const [saving, setSaving] = useState(false)

  if (!rules) return null
  const managers = users?.filter((u) => u.role === "manager") || []
  const allApprovers = users?.filter((u) => u.role !== "employee") || []

  const onSave = async () => {
    setSaving(true)
    saveRules(rules)
    setSaving(false)
    mutate()
  }

  return (
    <Card className="p-4 grid gap-6">
      <div className="grid gap-2">
        <Label>Approval rule for miscellaneous expenses</Label>
        <Input
          value={rules.name}
          onChange={(e) => mutate({ ...rules, name: e.target.value }, false)}
          placeholder="e.g., Default flow"
        />
      </div>

      <div className="grid gap-2">
        <Label>Description</Label>
        <Input
          value={rules.description}
          onChange={(e) => mutate({ ...rules, description: e.target.value }, false)}
          placeholder="Short description"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Is manager an approver?</Label>
          <select
            className="h-10 rounded-md border bg-background px-3"
            value={rules.includeManager ? "yes" : "no"}
            onChange={(e) => mutate({ ...rules, includeManager: e.target.value === "yes" }, false)}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <p className="text-xs text-muted-foreground">If yes, the submitter's manager is included as an approver.</p>
        </div>
        <div className="grid gap-2">
          <Label>Minimum approval percentage</Label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={100}
              value={rules.minPercent}
              onChange={(e) => mutate({ ...rules, minPercent: Number(e.target.value) }, false)}
              className="w-full"
            />
            <span className="tabular-nums">{rules.minPercent}%</span>
          </div>
          <p className="text-xs text-muted-foreground">Ceiling applied to compute required approvals.</p>
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Approver sequence</Label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!rules.sequential}
            onChange={(e) => mutate({ ...rules, sequential: e.target.checked }, false)}
          />
          Process approvers one-by-one (a rejection stops the flow).
        </label>
      </div>

      <div className="grid gap-2">
        <Label>Approvers</Label>
        <div className="overflow-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr className="text-left">
                <th className="p-2">User</th>
                <th className="p-2">Approver</th>
                <th className="p-2">Required</th>
              </tr>
            </thead>
            <tbody>
              {allApprovers.map((opt) => {
                const isApprover = (rules.specificApproverIds || []).includes(opt.id)
                const isRequired = (rules.requiredApproverIds || []).includes(opt.id)
                return (
                  <tr key={opt.id} className="border-t">
                    <td className="p-2">{opt.name}</td>
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={isApprover}
                        onChange={(e) => {
                          const set = new Set(rules.specificApproverIds || [])
                          if (e.target.checked) set.add(opt.id)
                          else {
                            set.delete(opt.id)
                          }
                          // if approver disabled, also clear required
                          const req = new Set(rules.requiredApproverIds || [])
                          if (!e.target.checked) req.delete(opt.id)
                          mutate({ ...rules, specificApproverIds: [...set], requiredApproverIds: [...req] }, false)
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={isRequired}
                        onChange={(e) => {
                          const approvers = new Set(rules.specificApproverIds || [])
                          const req = new Set(rules.requiredApproverIds || [])
                          if (e.target.checked) {
                            approvers.add(opt.id)
                            req.add(opt.id)
                          } else {
                            req.delete(opt.id)
                          }
                          mutate(
                            { ...rules, specificApproverIds: [...approvers], requiredApproverIds: [...req] },
                            false,
                          )
                        }}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Required approvers must approve regardless of percentage. Specific approver approval auto-approves the step.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Rules"}
        </Button>
      </div>
    </Card>
  )
}

function ApproverPicker({
  selected,
  options,
  onChange,
}: {
  selected: string[]
  options: { id: string; name: string }[]
  onChange: (ids: string[]) => void
}) {
  const toggle = (id: string) => {
    const set = new Set(selected)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    onChange([...set])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => toggle(opt.id)}
          className={`h-9 rounded-md border px-3 text-sm ${selected.includes(opt.id) ? "bg-primary text-primary-foreground" : "bg-background"}`}
        >
          {opt.name}
        </button>
      ))}
    </div>
  )
}
