import { Navbar } from "@/components/navbar"
import ExpenseFormDetailed from "@/components/employee/expense-form-detailed"

export default function NewExpensePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-semibold">New Expense</h2>
        <div className="mt-6">
          <ExpenseFormDetailed />
        </div>
      </section>
    </main>
  )
}
