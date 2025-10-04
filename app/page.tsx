import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSessionUser } from "@/lib/client-store"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { FeatureCard } from "@/components/marketing/feature-card"

export default function HomePage() {
  const user = getSessionUser()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,212,255,0.15),transparent_60%)] bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),transparent_60%)] bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.15),transparent_60%)] bg-[radial-gradient(circle_at_20%_70%,rgba(236,72,153,0.1),transparent_50%)]"></div>
      <Navbar />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4">
        <section className="w-full max-w-6xl text-center">
          <header className="mb-12">
          <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 drop-shadow-[0_0_30px_rgba(0,212,255,0.8)]">
            Xpenda
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-muted-foreground mb-8">Modern expense management for teams</h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-10">
            Submit receipts in any currency, route approvals to managers, and keep your company totals consistent in a
            single base currency.
          </p>

          <div className="flex flex-wrap items-center gap-4 justify-center">
            {!user ? (
              <>
                <Button asChild size="lg" className="glow text-lg px-8 py-4">
                  <Link href="/signup">Create company (Admin)</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="glow-teal text-lg px-8 py-4">
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            ) : (
              <>
                {user.role === "admin" && (
                  <>
                    <Button asChild size="lg" className="glow text-lg px-8 py-4">
                      <Link href="/admin">Admin Dashboard</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg" className="glow-purple text-lg px-8 py-4">
                      <Link href="/admin/rules">Approval Rules</Link>
                    </Button>
                  </>
                )}
                {user.role === "employee" && (
                  <>
                    <Button asChild size="lg" className="glow text-lg px-8 py-4">
                      <Link href="/employee">Employee</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg" className="glow-teal text-lg px-8 py-4">
                      <Link href="/employee/new">New Expense</Link>
                    </Button>
                  </>
                )}
                {user.role === "manager" && (
                  <Button asChild size="lg" className="glow text-lg px-8 py-4">
                    <Link href="/manager">Manager</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
          <FeatureCard title="Simple receipt capture">
            Upload from desktop or snap a photo. Keep drafts until you're ready to submit.
          </FeatureCard>
          <FeatureCard title="Multi‑currency, auto‑converted">
            Employees submit in local currency; managers review amounts converted to the company's base currency with
            up‑to‑date rates.
          </FeatureCard>
          <FeatureCard title="Configurable approvals">
            Define approvers, require the manager, choose sequential or parallel routing, and set a minimum approval
            percentage.
          </FeatureCard>
        </div>

          <div className="glass p-4 rounded-xl max-w-2xl mx-auto border border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              💡 Tip: Use the switcher in the top navigation to view Admin, Employee, or Manager flows instantly.
            </p>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="glass p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Contact Us</h3>
            <p className="text-muted-foreground mb-4">
              Have questions about Xpenda? We're here to help. Reach out to our support team.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> support@xpenda.com
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Address:</strong> 123 Tech Street, Innovation City, IC 12345
              </p>
            </div>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Additional Information</h3>
            <p className="text-muted-foreground mb-4">
              Learn more about our features and how Xpenda can streamline your expense management process.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Secure and compliant expense tracking</li>
              <li>• Real-time currency conversion</li>
              <li>• Automated approval workflows</li>
              <li>• Comprehensive reporting and analytics</li>
              <li>• Mobile-friendly interface</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Xpenda. All rights reserved. | Modern expense management for teams. | Contact: support@xpenda.com | Phone: +1 (555) 123-4567
          </p>
        </div>
      </footer>
    </main>
  )
}
