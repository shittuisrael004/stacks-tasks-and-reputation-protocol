;; =========================================================
;; Task & Reputation Protocol
;; Version: 1.0.0
;; =========================================================
;; A single-contract protocol for:
;; - Creating tasks with STX escrow
;; - Assigning and completing tasks
;; - Paying workers in STX
;; - Tracking reputation
;; - Supporting task cancellation
;; - Emergency fund recovery
;; =========================================================

;; ---------------------------------------------------------
;; Constants & Admin
;; ---------------------------------------------------------

;; Deployer is protocol admin
(define-constant ADMIN tx-sender)

;; Protocol version
(define-constant VERSION "1.0.0")

;; ---------------------------------------------------------
;; Protocol State
;; ---------------------------------------------------------

(define-data-var paused bool false)
(define-data-var next-task-id uint u1)

;; ---------------------------------------------------------
;; User & Reputation System
;; ---------------------------------------------------------

;; Registered users
(define-map users principal uint)

;; Reputation score per user
(define-map reputation principal int)

;; ---------------------------------------------------------
;; Task System
;; ---------------------------------------------------------

;; Task status codes
(define-constant STATUS-OPEN u0)
(define-constant STATUS-ASSIGNED u1)
(define-constant STATUS-SUBMITTED u2)
(define-constant STATUS-COMPLETED u3)
(define-constant STATUS-CANCELLED u4)

;; Task storage
(define-map tasks uint {
  creator: principal,
  worker: (optional principal),
  bounty: uint,
  status: uint
})

;; Submission proof (IPFS hash, URL, etc.)
(define-map submissions uint (string-ascii 64))

;; ---------------------------------------------------------
;; Internal Guards
;; ---------------------------------------------------------

(define-private (assert-not-paused)
  (asserts! (not (var-get paused)) (err u100)))

(define-private (assert-admin)
(asserts! (is-eq tx-sender ADMIN) (err u401)))

;; ---------------------------------------------------------
;; User Registration
;; ---------------------------------------------------------

(define-public (register)
  (begin
    (assert-not-paused)
    (map-set users tx-sender block-height)

    (print { event: "user_registered", user: tx-sender })

    (ok true)
  )
)

