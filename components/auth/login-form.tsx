"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { login, getSessionUser } from "@/lib/client-store"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = () => {
    const ok = login(email, password)
    if (!ok) {
      setError("Invalid email or password.")
      return
    }
    try {
      const u = getSessionUser?.()
      const role = u?.role || "employee"
      const target = role === "admin" ? "/admin" : role === "manager" ? "/manager" : "/employee"
      router.push(target)
    } catch {
      router.push("/employee")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>
        <div className="grid gap-2">
          <Label>Password</Label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} className="w-full glow">
          Login
        </Button>
      </CardFooter>
    </Card>
  )
}
