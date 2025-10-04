"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type RoleView = "admin" | "employee" | "manager"

const ROLE_ROUTES: Record<RoleView, string> = {
  admin: "/admin",
  employee: "/employee",
  manager: "/manager",
}

const STORAGE_KEY = "v0:last-role-view"

export function RoleSwitcher({
  className,
}: {
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [role, setRole] = useState<RoleView>("admin")

  // Initialize from path or localStorage
  useEffect(() => {
    const fromPath = pathname?.startsWith("/employee")
      ? "employee"
      : pathname?.startsWith("/manager")
        ? "manager"
        : pathname?.startsWith("/admin")
          ? "admin"
          : null

    const stored = typeof window !== "undefined" ? (window.localStorage.getItem(STORAGE_KEY) as RoleView | null) : null

    setRole((fromPath as RoleView) || stored || "admin")
  }, [pathname])

  const onChange = (next: RoleView) => {
    setRole(next)
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next)
      }
    } catch {}
    router.push(ROLE_ROUTES[next])
  }

  return (
    <div className={className}>
      <label htmlFor="role-switch" className="sr-only">
        Switch role view
      </label>
      <select
        id="role-switch"
        value={role}
        onChange={(e) => onChange(e.target.value as RoleView)}
        className="inline-block rounded-md border bg-background text-foreground px-2 py-1 text-sm"
        aria-label="Switch role view"
      >
        <option value="admin">Admin</option>
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
      </select>
    </div>
  )
}

export default RoleSwitcher
