;; ---------------------------------------------------------
;; Task Storage (SECURED)
;; - Only registered users can create tasks
;; - Protocol must not be paused
;; ---------------------------------------------------------

;; External contract references
(define-constant USER-REGISTRY .user-registry)
(define-constant PROTOCOL .protocol-registry)

;; Task structure
(define-map tasks uint {
  creator: principal,
  bounty: uint,
  status: uint ;; 0=open, 1=assigned, 2=completed
})

(define-public (create-task (id uint) (bounty uint))
  (begin
    ;; Check protocol is not paused
    (asserts! (not (contract-call? PROTOCOL is-paused)) (err u100))

    ;; Check user is registered
    (asserts! (contract-call? USER-REGISTRY is-registered tx-sender) (err u101))

    (map-set tasks id {
      creator: tx-sender,
      bounty: bounty,
      status: u0
    })

    (ok id)))