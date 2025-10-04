"use client"

import useSWR from "swr"
import { getMyExpenses, getCompanyCurrency, type Status } from "@/lib/client-store"

function sum(expenses: Array<{ status: Status; converted: { amount: number } }>, statuses: Status[]) {
  return expenses.filter((e) => statuses.includes(e.status)).reduce((acc, e) => acc + (e.converted?.amount || 0), 0)
}

export function SummaryStrip() {
  const { data: expenses = [] } = useSWR("my-expenses", getMyExpenses)
  const cur = getCompanyCurrency()

  const toSubmit = sum(expenses, ["draft"])
  const waiting = sum(expenses, ["submitted", "in_review"])
  const approved = sum(expenses, ["approved"])

  const Item = ({
    label,
    value,
  }: {
    label: string
    value: number
  }) => (
    <div className="flex-1 rounded-md border bg-card p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold">
        {value.toFixed(2)} {cur}
      </div>
    </div>
  )

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
      <Item label="To submit" value={toSubmit} />
      <Item label="Waiting approval" value={waiting} />
      <Item label="Approved" value={approved} />
    </div>
  )
}
