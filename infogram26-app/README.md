# INFOGRAM'26

Website for **INFOGRAM'26**, a national-level technical symposium — public event site plus an admin/organizer panel for managing events, registrations, and payments.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **State:** Zustand (`src/store/eventStore.ts`)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Payments:** Razorpay (primary) with UPI QR + UTR verification as fallback — see [`PAYMENT_FLOW.md`](./PAYMENT_FLOW.md)
- **Forms:** react-hook-form + zod

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` with:

```bash
# Firebase (client-side, safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Razorpay
RAZORPAY_KEY_ID=              # server-only
RAZORPAY_KEY_SECRET=          # server-only, never expose to client
NEXT_PUBLIC_RAZORPAY_KEY_ID=  # client, used to open the checkout widget (same value as RAZORPAY_KEY_ID)
```

If Razorpay keys aren't set, the payment page falls back to the UPI QR flow automatically — no code changes needed.

## Project Structure

```
src/
  app/
    (public)         # home, about, events, register, payment, ticket, contact
    admin/            # super admin panel — events, registrations, payments, gallery, sponsors, settings
    organizer/         # per-event organizer panel — dashboard, participants, winners
    admin-login/       # Google Sign-In gated by an email allowlist
    api/               # Razorpay order/verify routes, Google Sheets sync
  store/              # Zustand store for events/organizers (synced to Firestore)
  hooks/              # useAuth, useLiveRegistrations
  lib/
    firebase/         # Firebase config + Firestore/Storage helpers
    eventsData.ts     # official event catalog (single source of truth for brochure data)
    authorizedAdmins.ts # super admin email allowlist
```

## Admin Access

Admin login is Google Sign-In restricted to an explicit email allowlist in `src/lib/authorizedAdmins.ts`. Any other Google account is signed out immediately with an error — there is no demo/bypass mode.

## Deployment

Deployed on Vercel. Push to `main` to trigger a deployment.
