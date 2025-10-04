import { Navbar } from "@/components/navbar"
import { UsersTable } from "@/components/admin/users-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Team</h2>
          <Button asChild>
            <Link href="/admin/rules">Approval Rules</Link>
          </Button>
        </div>
        <p className="mt-2 text-muted-foreground">Invite members, set roles, and assign managers.</p>
        <div className="mt-6">
          <UsersTable />
        </div>
      </section>
    </main>
  )
}
