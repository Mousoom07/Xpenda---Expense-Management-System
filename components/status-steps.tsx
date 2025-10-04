"use client"

import { cn } from "@/lib/utils"

export function StatusSteps({
  current,
}: {
  current: "draft" | "waiting" | "approved" | "rejected"
}) {
  const steps: { key: typeof current; label: string }[] = [
    { key: "draft", label: "Draft" },
    { key: "waiting", label: "Waiting approval" },
    { key: "approved", label: "Approved" },
  ]
  return (
    <div className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <span
            className={cn(
              "rounded-md border px-2 py-1",
              s.key === current ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
            )}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && <span className="mx-2 text-muted-foreground">{">"}</span>}
        </div>
      ))}
    </div>
  )
}
