"use client"

import useSWR from "swr"
import { getMyExpenses, getCompanyCurrency, type Status, getSessionUser } from "@/lib/client-store"
import { Badge } from "@/components/ui/badge"

export function ExpenseTable({ filter }: { filter?: Status[] }) {
  const { data: expenses } = useSWR("my-expenses", getMyExpenses)
  const companyCur = getCompanyCurrency()
  const me = getSessionUser()
  const rows = (expenses || []).filter((e) => (filter ? filter.includes(e.status) : true))

  return (
    <div className="overflow-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60">
          <tr className="text-left">
            <th className="p-3">Employee</th>
            <th className="p-3">Description</th>
            <th className="p-3">Date</th>
            <th className="p-3">Category</th>
            <th className="p-3">Paid By</th>
            <th className="p-3">Remarks</th>
            <th className="p-3">{`Amount (${companyCur})`}</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((exp) => (
            <tr key={exp.id} className="border-t">
              <td className="p-3">{me?.name || "—"}</td>
              <td className="p-3">{exp.description}</td>
              <td className="p-3">{exp.date}</td>
              <td className="p-3">{exp.category}</td>
              <td className="p-3">{exp.paidBy}</td>
              <td className="p-3">{exp.note || "—"}</td>
              <td className="p-3">
                {exp.converted.amount.toFixed(2)} {exp.converted.currency}
              </td>
              <td className="p-3">
                <StatusBadge status={exp.status} />
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td className="p-3 text-muted-foreground" colSpan={8}>
                No expenses.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "bg-muted",
    submitted: "bg-secondary",
    in_review: "bg-secondary",
    approved: "bg-primary text-primary-foreground",
    rejected: "bg-destructive text-destructive-foreground",
  }
  const cls = map[status] || "bg-muted"
  return <Badge className={cls}>{status}</Badge>
}
