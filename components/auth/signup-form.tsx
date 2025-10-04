"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createCompanyAndAdmin } from "@/lib/client-store"
import { useRouter } from "next/navigation"

export function SignupForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    companyName: "",
    country: "",
    baseCurrency: "USD",
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "admin" as "admin" | "manager" | "employee",
  })
  const [error, setError] = useState<string | null>(null)

  const onSubmit = () => {
    setError(null)
    if (!form.companyName || !form.email || !form.password || !form.name) {
      setError("Please fill all required fields.")
      return
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.")
      return
    }
    createCompanyAndAdmin({
      companyName: form.companyName,
      country: form.country || "US",
      baseCurrency: form.baseCurrency,
      admin: { name: form.name, email: form.email, password: form.password, role: form.role },
    })
    const target = form.role === "admin" ? "/admin" : form.role === "manager" ? "/manager" : "/employee"
    router.push(target)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Signup</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label>Company Name</Label>
          <Input value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} />
        </div>
        <div className="grid gap-2">
          <Label>Country</Label>
          <select
            className="h-10 rounded-md border bg-background px-3"
            value={form.country}
            onChange={(e) => {
              const country = e.target.value
              const map: Record<string, string> = {
                "United States": "USD",
                "United Kingdom": "GBP",
                India: "INR",
                Germany: "EUR",
                France: "EUR",
                Spain: "EUR",
              }
              setForm((f) => ({ ...f, country, baseCurrency: map[country] || f.baseCurrency }))
            }}
          >
            <option value="">Select country</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Germany</option>
            <option>France</option>
            <option>Spain</option>
            <option>India</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Base currency auto-fills from country. You can override it below.
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Base Currency</Label>
          <select
            className="h-10 rounded-md border bg-background px-3"
            value={form.baseCurrency}
            onChange={(e) => setForm((f) => ({ ...f, baseCurrency: e.target.value }))}
          >
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>INR</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label>Your Name</Label>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="grid gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label>Your Role</Label>
          <select
            className="h-10 rounded-md border bg-background px-3"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as any }))}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
          <p className="text-xs text-muted-foreground">Choose the role for your initial account.</p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} className="w-full glow">
          Create and Continue
        </Button>
      </CardFooter>
    </Card>
  )
}
