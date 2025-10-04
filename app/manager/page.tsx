import { Navbar } from "@/components/navbar"
import { ApprovalsTable } from "@/components/manager/approvals-table"

export default function ManagerPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="sr-only">{"Manager\u2019s View"}</h1>
        <h2 className="text-2xl font-semibold">{"Approvals to review"}</h2>
        <div className="mt-6">
          <ApprovalsTable />
        </div>
      </section>
    </main>
  )
}
