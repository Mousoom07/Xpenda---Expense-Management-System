"use client"

import { Navbar } from "@/components/navbar"
import { ExpenseTable } from "@/components/employee/expense-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Status } from "@/lib/client-store"
import { StatusSteps } from "@/components/status-steps"
import { useRouter } from "next/navigation"
import { SummaryStrip } from "@/components/employee/summary-strip"

export default function EmployeePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">My Expenses</h2>
            <p className="mt-2 text-muted-foreground">Upload receipts, enter details, and submit for approval.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="glow-teal">
              <Link href="/employee/new">Upload</Link>
            </Button>
            <Button asChild className="glow">
              <Link href="/employee/new">New</Link>
            </Button>
          </div>
        </div>

        {/* Blueprint summary: To submit, Waiting approval, Approved */}
        <SummaryStrip />

        {/* Blueprint segmented flow */}
        <div className="mt-6">
          <Tabs defaultValue="drafts">
            <TabsList>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="waiting">Waiting approval</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
            </TabsList>

            <TabsContent value="drafts" className="mt-4">
              <div className="mb-3">
                <StatusSteps current="draft" />
              </div>
              <ExpenseTable filter={["draft" as Status]} />
            </TabsContent>
            <TabsContent value="waiting" className="mt-4">
              <div className="mb-3">
                <StatusSteps current="waiting" />
              </div>
              <ExpenseTable filter={["submitted" as Status, "in_review" as Status]} />
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <div className="mb-3">
                <StatusSteps current="approved" />
              </div>
              <ExpenseTable filter={["approved" as Status]} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
