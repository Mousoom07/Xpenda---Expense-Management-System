import { Navbar } from "@/components/navbar"
import AdminRuleEditor from "@/components/admin/admin-rule-editor"

export default function RulesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="text-2xl font-semibold">Approval Rules</h2>
        <p className="mt-2 text-muted-foreground">
          Configure approvers for expense steps and define minimum approval percentage.
        </p>
        <div className="mt-6">
          <AdminRuleEditor />
        </div>
      </section>
    </main>
  )
}
