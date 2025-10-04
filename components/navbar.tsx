"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getSessionUser, logout } from "@/lib/client-store"
import { RoleSwitcher } from "@/components/role-switcher"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = getSessionUser()

  const currentView: "admin" | "employee" | "manager" | "" = pathname?.startsWith("/admin")
    ? "admin"
    : pathname?.startsWith("/employee")
      ? "employee"
      : pathname?.startsWith("/manager")
        ? "manager"
        : ""

  function goTo(role: "admin" | "employee" | "manager") {
    // Persist last chosen view for convenience
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ems-last-view", role)
      } catch {}
    }
    router.push(role === "admin" ? "/admin" : role === "manager" ? "/manager" : "/employee")
  }

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-extrabold text-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,212,255,0.7)] hover:drop-shadow-[0_0_25px_rgba(0,212,255,1)] transition-all duration-300">
          Xpenda
        </Link>
        <nav className="flex items-center gap-3">
          {!user && (
            <>
              <Link className="text-sm text-muted-foreground" href="/signup">
                Signup
              </Link>
              <Link className="text-sm text-muted-foreground" href="/login">
                Login
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Link className="text-sm text-muted-foreground" href="/admin">
                Admin
              </Link>
              <Link className="text-sm text-muted-foreground" href="/admin/rules">
                Rules
              </Link>
            </>
          )}
          {user?.role === "employee" && (
            <>
              <Link className="text-sm text-muted-foreground" href="/employee">
                Employee
              </Link>
              <Link className="text-sm text-muted-foreground" href="/employee/new">
                New
              </Link>
            </>
          )}
          {user?.role === "manager" && (
            <Link className="text-sm text-muted-foreground" href="/manager">
              Manager
            </Link>
          )}

          {user && (
            <label className="sr-only" htmlFor="role-view-select">
              Switch role view
            </label>
          )}
          {user && (
            <>
              <RoleSwitcher />
            </>
          )}

          {user && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                logout()
                router.push(pathname === "/" ? "/" : "/")
              }}
            >
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
