"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusSteps } from "@/components/status-steps"
import { createExpenseDraft, submitExpense, getCompanyCurrency } from "@/lib/client-store"
import { createWorker } from "tesseract.js"

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AED"]

export default function ExpenseFormDetailed() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [ocrLoading, setOcrLoading] = useState(false) // OCR loading state
  const [form, setForm] = useState({
    description: "",
    date: "",
    category: "",
    paidBy: "",
    note: "",
    amount: "",
    currency: "USD",
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const exp = createExpenseDraft({
      description: form.description,
      category: form.category,
      date: form.date,
      amount: Number(form.amount || 0),
      currency: form.currency,
      paidBy: form.paidBy,
      note: form.note,
      receiptName: file?.name,
    })
    submitExpense(exp.id)
    router.push("/employee")
  }

  async function handleScanAndCreate() {
    if (!file) return
    setOcrLoading(true)
    try {
      const worker = await createWorker()
      await worker.loadLanguage("eng")
      await worker.initialize("eng")
      const { data } = await worker.recognize(file)
      await worker.terminate()

      const text = data?.text || ""

      // Try to parse amount: pick the largest number with optional decimals
      const numMatches = text.match(/\d+[.,]?\d{0,2}/g) || []
      const amounts = numMatches.map((s) => Number(s.replace(/,/g, ""))).filter((n) => !Number.isNaN(n) && n > 0)
      const amount = amounts.length ? Math.max(...amounts) : 0

      // Detect currency hints
      const raw = text.toUpperCase()
      const detectedCurrency =
        raw.includes("INR") || raw.includes("₹")
          ? "INR"
          : raw.includes("EUR") || raw.includes("€")
            ? "EUR"
            : raw.includes("GBP") || raw.includes("£")
              ? "GBP"
              : "USD"

      // Parse date in common formats: dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd
      const dateMatch = text.match(/\b(\d{2})[/-](\d{2})[/-](\d{4})\b/) || text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)
      let dateStr = new Date().toISOString().slice(0, 10)
      if (dateMatch) {
        if (dateMatch[0].includes("-") && dateMatch[0].length === 10 && dateMatch[0].match(/\d{4}-\d{2}-\d{2}/)) {
          dateStr = dateMatch[0]
        } else {
          const [dd, mm, yyyy] = dateMatch[0].split(/[/-]/)
          dateStr = `${yyyy}-${mm}-${dd}`
        }
      }

      const desc = "Receipt OCR"
      const paidBy = "Me"
      const currency = detectedCurrency || getCompanyCurrency?.() || form.currency || "USD"

      const exp = createExpenseDraft({
        description: desc,
        category: form.category || "Misc",
        date: dateStr,
        amount: Number(amount.toFixed(2)),
        currency,
        paidBy,
        note: form.note,
        receiptName: file?.name,
      })
      submitExpense(exp.id)
      router.push("/employee")
    } catch (e) {
      console.error("[v0] OCR error:", (e as Error).message)
      setOcrLoading(false)
      // Fall back to manual if OCR fails
      alert("Could not read the receipt. You can still submit manually.")
    } finally {
      setOcrLoading(false)
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            type="button"
            className="font-medium"
            onClick={handleScanAndCreate}
            disabled={!file || ocrLoading}
          >
            {ocrLoading ? "Scanning..." : "Scan Receipt (OCR)"}
          </Button>
          <StatusSteps current="draft" />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="e.g., Restaurant bill"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Expense Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paidBy">Paid by</Label>
              <Input
                id="paidBy"
                value={form.paidBy}
                onChange={(e) => setForm((f) => ({ ...f, paidBy: e.target.value }))}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="note">Remarks</Label>
              <Input id="note" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label>Total amount</Label>
              <div className="flex items-center gap-3">
                <Input
                  inputMode="decimal"
                  pattern="[0-9]*"
                  className="max-w-[200px]"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                />
                <Select value={form.currency} onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="longDesc">Description</Label>
              <Textarea
                id="longDesc"
                placeholder="Add more details if needed"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="receipt">Receipt</Label>
              <Input
                id="receipt"
                type="file"
                accept="image/*,application/pdf"
                capture="environment"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground">
                Upload from computer or take a photo; use Scan to auto-create.
              </p>
            </div>
          </div>
          <div className="flex justify-start gap-3">
            <Button type="submit" className="min-w-[140px]">
              Submit
            </Button>
            <Button type="button" variant="outline" onClick={handleScanAndCreate} disabled={!file || ocrLoading}>
              {ocrLoading ? "Scanning..." : "Scan & Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
