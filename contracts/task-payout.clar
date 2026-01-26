;; ---------------------------------------------------------
;; Task Payout
;; Pays contributors in STX
;; ---------------------------------------------------------


(define-public (payout (worker principal) (amount uint))
    (begin
        ;; Transfers STX from contract to worker
        (try! (stx-transfer? amount (as-contract tx-sender) worker))
        (ok amount)
    )
)

(define-public (fund (amount uint))
    (begin
        ;; Transfers STX from user to contract
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (ok amount)
    )
)
