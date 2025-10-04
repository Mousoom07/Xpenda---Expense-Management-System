"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createExpenseDraft, submitExpense, getCompany } from "@/lib/client-store"
import { useRouter } from "next/navigation"
import { StatusSteps } from "@/components/status-steps"

export function ExpenseForm() {
  const router = useRouter()
  const company = getCompany()
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    description: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    currency: company?.baseCurrency || "USD",
    paidBy: "Me",
    note: "",
  })

  const onSave = () => {
    if (!form.amount || !form.description) return
    const draft = createExpenseDraft({
      description: form.description,
      category: form.category || "Misc",
      date: form.date,
      amount: Number(form.amount),
      currency: form.currency,
      paidBy: form.paidBy,
      note: form.note,
      receiptName: file?.name,
    })
    submitExpense(draft.id)
    router.push("/employee")
  }

  return (
    <Card className="p-4 grid gap-4">
      <div className="flex items-center justify-between">
        <StatusSteps current="draft" />
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="grid w-[280px] gap-2">
          <Label>Attach Receipt</Label>
          <Input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {file && <span className="text-xs text-muted-foreground">Attached: {file.name}</span>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="e.g., Restaurant bill"
          />
        </div>
        <div className="grid gap-2">
          <Label>Expense Date</Label>
          <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        </div>
        <div className="grid gap-2">
          <Label>Category</Label>
          <Input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            placeholder="Meals, Travel, …"
          />
        </div>
        <div className="grid gap-2">
          <Label>Paid By</Label>
          <select
            className="h-10 rounded-md border bg-background px-3"
            value={form.paidBy}
            onChange={(e) => setForm((f) => ({ ...f, paidBy: e.target.value }))}
          >
            <option>Me</option>
            <option>Company</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label>Total Amount</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="w-full"
            />
            <select
              className="h-10 rounded-md border bg-background px-3"
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>INR</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            Will convert to {company?.baseCurrency || "USD"} for approvals.
          </p>
        </div>
        <div className="grid gap-2 md:col-span-2">
          <Label>Notes</Label>
          <Input
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="Optional note"
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button onClick={onSave}>Submit</Button>
      </div>
    </Card>
  )
}
