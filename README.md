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

