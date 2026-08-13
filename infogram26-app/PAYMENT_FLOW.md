# Payment Flow

**Primary: Razorpay. Fallback: UPI QR + UTR verification.**

## How it works

1. Student finishes `/register`, lands on `/payment?regId=<id>`.
2. Page shows one button: **Pay ₹X with Razorpay**.
3. Click → `POST /api/payment/create-order` creates a Razorpay order → Razorpay checkout modal opens.
4. On success → `POST /api/payment/verify` checks the HMAC signature server-side.
5. Verified → payment recorded, registration marked `paid`, ticket generated, redirect to `/ticket/<id>`.

## Fallback trigger

QR + UTR form appears if any of:
- Razorpay checkout script fails to load
- `/api/payment/create-order` errors (bad/missing keys, network)
- Payment fails inside the Razorpay modal (`payment.failed` event)
- Signature verification fails
- User clicks "Trouble with Razorpay? Pay via UPI QR instead"

Fallback form: scan QR / copy UPI ID → pay manually → enter 12-digit UTR + upload screenshot → submit. Same success path as Razorpay (payment record, `paid` status, ticket, redirect) — just `method: 'upi'` instead of `'razorpay'`.

## Required env vars

```
RAZORPAY_KEY_ID=...              # server, used by /api/payment/create-order and /verify
RAZORPAY_KEY_SECRET=...          # server only, never exposed to client
NEXT_PUBLIC_RAZORPAY_KEY_ID=...  # client, used to open the Razorpay checkout widget (same value as RAZORPAY_KEY_ID)
```

If these aren't set, `create-order` returns an error and the page falls back to UPI automatically — no code change needed to run UPI-only.

## Files

| File | Role |
|---|---|
| `src/app/payment/page.tsx` | UI, Razorpay checkout trigger, fallback logic, shared `finalizePayment()` |
| `src/app/api/payment/create-order/route.ts` | Creates Razorpay order (server-side, keeps secret off client) |
| `src/app/api/payment/verify/route.ts` | Verifies Razorpay signature (server-side) |

## Data written on success (both paths)

- `payments/{id}` — `method: 'razorpay' | 'upi'`, amount, status, razorpay ids or UTR/screenshot
- `registrations/{regId}` — `status: 'paid'`, `paymentId`
- `tickets/{id}` — QR ticket, `paymentMethod` field records which path was used
- `/api/sheets` — best-effort sync, failure here does not block ticket generation

## Known bug fixed here

Previously, the post-payment redirect read `ticketId` from React state inside a `setTimeout` closure — state hadn't updated yet at that point, so **every real payment redirected to a fake mock ticket** (`/ticket/mock_ticket_123`) instead of the user's real one. Fixed by capturing the new ticket ID in a local variable (`newTicketId`) before scheduling the redirect.
