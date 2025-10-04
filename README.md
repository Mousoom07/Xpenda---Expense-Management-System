Xpenda: Smart Expense Management

🌟 Overview
Xpenda is a modern, intelligent expense management system designed to eliminate the common pain points of manual expense reimbursement: long processing times, errors, and lack of transparency. It centralizes expense submission, automates multi-level approvals, and supports flexible, conditional approval rules, allowing companies to manage their finances efficiently and with high compliance.

✨ Key Features
1. 🚀 Simplified Expense Submission
Multi-Currency Support: Employees can submit claims in any currency; the system handles the conversion to the company's default currency.

Required Fields: Capture essential data including Amount, Category, Description, and Date.

History & Status: Employees can view a complete history of their claims, including real-time approval status (Approved/Rejected).

2. 🤖 Intelligent OCR Receipt Processing (Upcoming)
Employees can simply scan a physical receipt.

The system uses an OCR algorithm to automatically extract and populate all necessary expense fields, such as amount, date, description, expense type, and merchant name.

3. ⚙️ Robust Approval Workflow
Multi-Level Sequential Approval: Configure step-by-step approval paths (e.g., Manager → Finance → Director) with the sequence defined by the Admin.

Manager Pre-Approval: Expenses are optionally routed to the immediate manager first, based on system configuration (IS MANAGER APPROVER field).

Real-Time Handoff: Claims only move to the next approver once the current one has explicitly approved it.

4. 📐 Flexible Conditional Approval Rules
Admins can set up complex rules to automatically approve or reject claims, ensuring compliance and speed:

Percentage Rule: E.g., If 60% of assigned approvers approve, the expense is cleared.

Specific Approver Rule: E.g., Approval by the CFO automatically overrides other steps and clears the expense.

Hybrid Combination: Allows for combining percentage and specific approver logic (e.g., 60% approval OR CFO approval).

👤 Roles and Permissions
Xpenda is designed with three core roles, each with specific permissions:

Role

Core Responsibilities

Admin

Initial company setup, user management, role assignment, configuration of all approval rules, complete visibility into all expenses, and the ability to override any approval decision.

Manager

View and act on expenses pending approval, approve/reject claims with comments (with amounts visible in the company's default currency), and view team expenses.

Employee

Submit new expense claims, view their personal expense history, and check the current approval status of their claims.

🛠️ Technical Details & APIs
Authentication & Setup
Upon initial login/signup, a Company and an Admin User are auto-created.

The system environment's selected country currency is set as the default company currency.

External APIs
The system integrates with external APIs to ensure accurate and up-to-date financial data:

Country and Currency Data: Used for mapping countries to their respective currencies during setup.

https://restcountries.com/v3.1/all?fields=name,currencies

Currency Conversion: Used to perform necessary conversions when employees submit claims in a foreign currency.

https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY}

💡 Getting Started (For Developers)
(This section would include setup instructions, environment variables, and local deployment guides specific to the tech stack chosen for Xpenda.)
