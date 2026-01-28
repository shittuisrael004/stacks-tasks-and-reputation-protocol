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