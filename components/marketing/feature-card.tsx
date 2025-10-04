import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FeatureCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-border bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground leading-relaxed">{children}</CardContent>
    </Card>
  )
}
