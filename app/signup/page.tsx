import { SignupForm } from "@/components/auth/signup-form"
import { Navbar } from "@/components/navbar"

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="w-full max-w-lg glass p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_20px_rgba(0,212,255,0.7)]">
              Join Xpenda
            </h1>
            <p className="text-muted-foreground">Create your company account</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </main>
  )
}
