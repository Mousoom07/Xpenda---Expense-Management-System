// Simple localStorage-backed store to simulate backend + rules + approvals

export type Role = "admin" | "manager" | "employee"
export type Status = "draft" | "submitted" | "in_review" | "approved" | "rejected"

export interface Company {
  id: string
  name: string
  country: string
  baseCurrency: string
}

export interface User {
  id: string
  name: string
  email: string
  password?: string
  role: Role
  managerId?: string
}

export interface Rules {
  name: string
  description: string
  includeManager: boolean
  specificApproverIds: string[]
  minPercent: number // 1-100
  sequential?: boolean
  requiredApproverIds?: string[]
}

export interface Expense {
  id: string
  ownerId: string
  description: string
  category: string
  date: string // yyyy-mm-dd
  amount: number
  currency: string
  converted: { amount: number; currency: string; rate: number }
  paidBy: string
  note?: string
  receiptName?: string
  status: Status
  approverIds: string[]
  approvals: { userId: string; status: "blocked" | "pending" | "approved" | "rejected" }[]
}

type State = {
  company?: Company
  users: User[]
  rules: Rules
  expenses: Expense[]
  sessionUserId?: string
}

const KEY = "ems-state-v1"

function nanoid() {
  return Math.random().toString(36).slice(2, 10)
}

function load(): State {
  if (typeof window === "undefined") return initial()
  const raw = localStorage.getItem(KEY)
  if (!raw) return initial()
  try {
    return JSON.parse(raw) as State
  } catch {
    return initial()
  }
}
function save(s: State) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(s))
}

function initial(): State {
  const indianManagerNames = [
    "Aarav Sharma",
    "Vivaan Gupta",
    "Aditya Verma",
    "Krishna Iyer",
    "Rohan Mehta",
    "Ishaan Nair",
    "Arjun Malhotra",
    "Rahul Kapoor",
    "Siddharth Rao",
    "Vikram Singh",
    "Karan Patel",
    "Manish Joshi",
  ]
  const seededManagers: User[] = indianManagerNames.map((name, idx) => ({
    id: nanoid(),
    name,
    email: `${name.toLowerCase().replace(/\\s+/g, ".")}@example.com`,
    role: "manager" as Role,
  }))

  return {
    users: seededManagers,
    expenses: [],
    rules: {
      name: "Default",
      description: "Default approval rule",
      includeManager: true,
      specificApproverIds: [],
      minPercent: 60,
      sequential: false,
      requiredApproverIds: [],
    },
  }
}

const state: State = load()

function commit() {
  save(state)
}

export function getCompany() {
  return state.company
}
export function getCompanyCurrency() {
  return state.company?.baseCurrency || "USD"
}

export function createCompanyAndAdmin(args: {
  companyName: string
  country: string
  baseCurrency: string
  admin: { name: string; email: string; password: string; role: Role }
}) {
  state.company = { id: nanoid(), name: args.companyName, country: args.country, baseCurrency: args.baseCurrency }
  const admin: User = {
    id: nanoid(),
    name: args.admin.name,
    email: args.admin.email,
    password: args.admin.password,
    role: args.admin.role, // use provided role
  }
  state.users.push(admin)
  state.sessionUserId = admin.id
  commit()
}

export function addUser(input: { name: string; email: string; role: Role }) {
  const u: User = { id: nanoid(), name: input.name, email: input.email, role: input.role }
  state.users.push(u)
  commit()
}

export function updateUserRole(userId: string, role: Role) {
  const u = state.users.find((u) => u.id === userId)
  if (!u) return
  u.role = role
  commit()
}

export function setManagerForUser(userId: string, managerId?: string) {
  const u = state.users.find((u) => u.id === userId)
  if (!u) return
  u.managerId = managerId || undefined
  commit()
}

export function getAllUsers() {
  return state.users
}

export function getSessionUser(): User | undefined {
  return state.users.find((u) => u.id === state.sessionUserId)
}

export function login(email: string, password: string) {
  const u = state.users.find((u) => u.email === email && (u.password ? u.password === password : true))
  if (u) {
    state.sessionUserId = u.id
    commit()
    return true
  }
  return false
}

export function logout() {
  state.sessionUserId = undefined
  commit()
}

export function getRules() {
  return state.rules
}
export function saveRules(r: Rules) {
  state.rules = r
  commit()
}

const RATES: Record<string, number> = {
  // USD base
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.0,
}

function convert(amount: number, from: string, to: string) {
  const base = amount / (RATES[from] ?? 1)
  const out = base * (RATES[to] ?? 1)
  const rate = (RATES[to] ?? 1) / (RATES[from] ?? 1)
  return { amount: Number(out.toFixed(2)), currency: to, rate: Number(rate.toFixed(6)) }
}

export function createExpenseDraft(input: {
  description: string
  category: string
  date: string
  amount: number
  currency: string
  paidBy: string
  note?: string
  receiptName?: string
}) {
  const me = getSessionUser()
  if (!me) throw new Error("Not signed in")
  const companyCur = getCompanyCurrency()
  const exp: Expense = {
    id: nanoid(),
    ownerId: me.id,
    description: input.description,
    category: input.category,
    date: input.date,
    amount: input.amount,
    currency: input.currency,
    converted: convert(input.amount, input.currency, companyCur),
    paidBy: input.paidBy,
    note: input.note,
    receiptName: input.receiptName,
    status: "draft",
    approverIds: [],
    approvals: [],
  }
  state.expenses.push(exp)
  commit()
  return exp
}

function computeApproversFor(exp: Expense) {
  const rule = state.rules
  const ids = new Set<string>()
  if (rule.includeManager) {
    const owner = state.users.find((u) => u.id === exp.ownerId)
    if (owner?.managerId) ids.add(owner.managerId)
  }
  for (const id of rule.specificApproverIds) ids.add(id)
  return [...ids]
}

export function submitExpense(expenseId: string) {
  const exp = state.expenses.find((e) => e.id === expenseId)
  if (!exp) return
  exp.status = "submitted"
  exp.approverIds = computeApproversFor(exp)
  if (state.rules.sequential) {
    exp.approvals = exp.approverIds.map((id, idx) => ({ userId: id, status: idx === 0 ? "pending" : "blocked" }))
  } else {
    exp.approvals = exp.approverIds.map((id) => ({ userId: id, status: "pending" }))
  }
  if (exp.approvals.length === 0) {
    exp.status = "approved"
  } else {
    exp.status = "in_review"
  }
  commit()
  evaluateStep(exp)
  commit()
}

function evaluateStep(exp: Expense) {
  const rule = state.rules
  if (exp.approvals.length === 0) {
    exp.status = "approved"
    return
  }

  if (
    (rule.specificApproverIds || []).some((id) => exp.approvals.find((a) => a.userId === id && a.status === "approved"))
  ) {
    exp.status = "approved"
    return
  }

  if (rule.sequential) {
    if (exp.approvals.some((a) => a.status === "rejected")) {
      exp.status = "rejected"
      return
    }
    if (exp.approvals.every((a) => a.status === "approved")) {
      exp.status = "approved"
      return
    }
    exp.status = "in_review"
    return
  }

  const total = exp.approvals.length
  const approvals = exp.approvals.filter((a) => a.status === "approved").length
  const rejections = exp.approvals.filter((a) => a.status === "rejected").length
  const pending =
    exp.approvals.filter((a) => a.status === "pending").length +
    exp.approvals.filter((a) => a.status === "blocked").length

  const requiredIds = new Set(rule.requiredApproverIds || [])
  const requiredRejected = exp.approvals.some((a) => requiredIds.has(a.userId) && a.status === "rejected")
  if (requiredRejected) {
    exp.status = "rejected"
    return
  }
  const allRequiredApproved = (rule.requiredApproverIds || []).every((id) =>
    exp.approvals.some((a) => a.userId === id && a.status === "approved"),
  )

  const requiredCount = Math.ceil(((rule.minPercent || 0) / 100) * total)
  if (allRequiredApproved && approvals >= requiredCount) {
    exp.status = "approved"
    return
  }

  if (approvals + pending < requiredCount) {
    exp.status = "rejected"
    return
  }

  exp.status = "in_review"
}

export function getMyExpenses() {
  const me = getSessionUser()
  if (!me) return []
  return state.expenses.filter((e) => e.ownerId === me.id).sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPendingApprovalsForMe() {
  const me = getSessionUser()
  if (!me) return []
  const rows = state.expenses
    .filter((e) => e.status === "in_review" || e.status === "submitted")
    .filter((e) => e.approvals.some((a) => a.userId === me.id && a.status === "pending"))
    .map((e) => ({
      expense: e,
      ownerName: state.users.find((u) => u.id === e.ownerId)?.name || "Unknown",
    }))
  return rows
}

export function actOnApproval(expenseId: string, decision: "approve" | "reject") {
  const me = getSessionUser()
  if (!me) return
  const exp = state.expenses.find((e) => e.id === expenseId)
  if (!exp) return
  const item = exp.approvals.find((a) => a.userId === me.id && a.status === "pending")
  if (!item) return
  item.status = decision === "approve" ? "approved" : "rejected"

  if (state.rules.sequential && decision === "approve") {
    const next = exp.approvals.find((a) => a.status === "blocked")
    if (next) next.status = "pending"
  }

  evaluateStep(exp)
  commit()
}

export function setRandomPassword(userId: string) {
  const u = state.users.find((x) => x.id === userId)
  if (!u) return null
  const pwd = Math.random().toString(36).slice(2, 10)
  u.password = pwd
  commit()
  return pwd
}
