# Stacks Tasks & Reputation Protocol

A single-contract, on-chain task marketplace and reputation system built on the **Stacks blockchain** using **Clarity**.

This project demonstrates real-world smart contract engineering skills: STX escrow, access control, lifecycle management, event-driven design, and safe recovery patterns, all implemented with junior-friendly clarity and production-aware tradeoffs.

The protocol has been **tested on Stacks Testnet and deployed on Stacks Mainnet**, with all core flows manually verified.

---

## 🎯 Why This Project Exists

This project was built to demonstrate **practical, non-trivial Clarity development**, not just isolated examples.

It focuses on the kinds of problems real protocols face:

* Safely handling **STX transfers and escrow**
* Managing complex **state transitions** on-chain
* Enforcing **access control and ownership**
* Designing for **frontend integration and indexing**
* Making explicit **trust and centralization tradeoffs**

The goal is clarity, correctness, and composability, not unnecessary abstraction.

---

## 🧠 What This Protocol Demonstrates

* STX escrow using `stx-transfer?` and `as-contract`
* Task lifecycle management (create → assign → submit → review)
* Refund-safe task cancellation
* On-chain reputation tracking
* Admin-controlled emergency recovery (clearly scoped and documented)
* Event emission (`print`) for indexers and frontends
* Defensive programming with guards and explicit response handling

---

## 🧱 Architecture Overview

The protocol is implemented as a **single, cohesive smart contract**.

This design was chosen intentionally to:

* Simplify frontend integration
* Reduce cross-contract complexity
* Make state transitions easier to reason about
* Improve auditability and readability

### Core Components

* **User Registry** – tracks registered participants
* **Task System** – manages task creation, assignment, submission, and completion
* **Escrow Logic** – locks STX until task resolution
* **Reputation System** – rewards successful task completion
* **Admin Controls** – pause control and emergency fund recovery
* **Event Layer** – emits structured events for off-chain indexing

---

## 🔁 Task Lifecycle

1. **User Registration**
2. **Task Creation** (STX escrowed into contract)
3. **Worker Assignment**
4. **Task Submission** (proof stored on-chain)
5. **Review & Resolution**
   * Approval → STX paid to worker + reputation increase
   * Rejection → task re-opened
6. **Optional Cancellation** (refunds creator if unresolved)

Each state transition is validated on-chain and emits an event.

---

## 🛡️ Emergency Withdrawal & Trust Model

This protocol includes an **admin-controlled emergency withdrawal function**.

### Why it exists

* Recover funds in case of critical bugs
* Handle unexpected locked STX scenarios
* Protect users during early-stage development

### Important constraints

* Only callable by the deployer (admin)
* Withdraws the **entire contract balance** (no selective draining)
* Emits a public on-chain event
* Clearly documented and visible

This is an intentional v1 design choice. In future versions, this mechanism can be replaced with time-locks, multisig, or DAO-based governance.

---

