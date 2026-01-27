;; ---------------------------------------------------------
;; Protocol Fees
;; Fixed STX protocol fee
;; ---------------------------------------------------------

(define-constant FEE u1000)


(define-public (pay-fee)
    (begin
        (try! (stx-transfer? FEE tx-sender (as-contract tx-sender)))
        (ok FEE)
    )
)
