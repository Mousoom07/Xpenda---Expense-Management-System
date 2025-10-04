"use client"

import useSWR from "swr"
import { getPendingApprovalsForMe, actOnApproval } from "@/lib/client-store"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ApprovalsTable() {
  const { data: rows, mutate } = useSWR("approvals-for-me", getPendingApprovalsForMe)
  const [busy, setBusy] = useState<Record<string, boolean>>({})

  const onAct = async (expenseId: string, decision: "approve" | "reject") => {
    setBusy((b) => ({ ...b, [expenseId]: true }))
    actOnApproval(expenseId, decision)
    try {
      await mutate()
    } finally {
      setBusy((b) => {
        const { [expenseId]: _omit, ...rest } = b
        return rest
      })
    }
  }

  const statusClass: Record<string, string> = {
    approved: "bg-primary text-primary-foreground",
    rejected: "bg-destructive text-destructive-foreground",
    in_review: "bg-muted text-foreground",
    submitted: "bg-muted text-foreground",
    draft: "bg-muted text-foreground",
  }

  return (
    <div className="overflow-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60">
          <tr className="text-left">
            <th className="p-3">Approval Subject</th>
            <th className="p-3">Request Owner</th>
            <th className="p-3">Category</th>
            <th className="p-3">Request Status</th>
            <th className="p-3">Total amount (in company's currency)</th>
            <th className="p-3">Approve</th>
            <th className="p-3">Reject</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((r) => {
            const id = r.expense.id
            const isBusy = !!busy[id]
            const status = r.expense.status
            return (
              <tr key={id} className="border-t">
                <td className="p-3">{r.expense.description}</td>
                <td className="p-3">{r.ownerName}</td>
                <td className="p-3">{r.expense.category}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${statusClass[status] || "bg-muted text-foreground"}`}
                    aria-label={`request status: ${status}`}
                  >
                    {status === "in_review" ? "Waiting approval" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </td>
                <td className="p-3">
                  <div className="leading-5">
                    <div className="font-medium">
                      {r.expense.converted.amount.toFixed(2)} {r.expense.converted.currency}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.expense.amount.toFixed(2)} {r.expense.currency}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <Button size="sm" disabled={isBusy} onClick={() => onAct(id, "approve")} aria-label="Approve request">
                    Approve
                  </Button>
                </td>
                <td className="p-3">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isBusy}
                    onClick={() => onAct(id, "reject")}
                    aria-label="Reject request"
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            )
          })}
          {!rows?.length && (
            <tr>
              {/* 7 columns total */}
              <td className="p-3 text-muted-foreground" colSpan={7}>
                No pending approvals.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
