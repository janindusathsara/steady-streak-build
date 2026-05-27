
## Scope

1. **Find Services button** on homeowner dashboard → `/services` (Navbar shows profile + Dashboard, already done in last turn).
2. **Book Now button** on homeowner dashboard / service pages → starts the 5-step booking flow shown in the attached mockups.
3. **5-step booking wizard** at `/book` matching the screenshots:
   - Step 1 — Select Service (category, sub-service, job type, problem desc)
   - Step 2 — Choose Provider (list with filters, "Your Selection" sidebar)
   - Step 3 — Schedule (calendar + time slots + service address)
   - Step 4 — Review & Confirm + Payment method
   - Step 5 — Booking Done (confirmation + ref number + checklist + assigned pro)
4. **Auth gate**: If an unlogged-in user clicks Book Now / starts booking, redirect to `/login?redirect=...`. After login, resume the booking flow with the previously-selected service preserved (via URL search params).
5. **Provider jobs page** at `/$username/jobs` — list of bookings assigned to the logged-in provider, with Accept / Mark In-Progress / Mark Complete actions. Link it from the provider dashboard header.
6. **Notifications**: when a homeowner places a booking, insert a row into `notifications` for the target provider; provider's jobs page reads from `bookings` + shows a notifications bell badge.

## DB (one migration)

Tables (all with GRANTs + RLS):
- `service_categories` (seeded: plumbing, electrical, painting, carpentry, hvac, cleaning, masonry, welding) — anon SELECT
- `sub_services` (FK category, name, base_price) — anon SELECT
- `providers` (FK profile_id, headline, rating, jobs_done, years_exp, hourly_rate, city, distance_km, verified, top_rated) — anon SELECT, owner UPDATE
- `bookings` (homeowner_id, provider_id, sub_service_id, job_type ['on_the_spot'|'scheduled'], scheduled_date, scheduled_time, address_line, district, postal_code, landmarks, problem_desc, status ['pending'|'accepted'|'in_progress'|'completed'|'cancelled'], total_amount, ref_code)
   - Homeowner: SELECT/INSERT/UPDATE own (where homeowner_id = auth.uid())
   - Provider: SELECT/UPDATE where provider_id matches their profile
- `notifications` (user_id, type, title, body, booking_id, read_at) — owner SELECT/UPDATE, anyone with the trigger can INSERT via service_role
- Trigger on `bookings INSERT` → insert a notification for the provider's profile

Seed a few providers tied to the existing test users so the flow has data.

## Routes / files

New:
- `src/routes/_authenticated.book.tsx` — wizard shell (reads `?service=&provider=&step=` from search)
- `src/routes/book.tsx` (public bounce) → if no session, redirect `/login?redirect=/book?...`; else forward to `/_authenticated/book`
- `src/pages/booking/BookingWizard.tsx` + step components (`Step1Service`, `Step2Provider`, `Step3Schedule`, `Step4Review`, `Step5Done`)
- `src/routes/_authenticated.$username.jobs.tsx` + `src/pages/jobs/ProviderJobsPage.tsx`
- `src/lib/booking.ts` (types + helpers: createBooking, listProviders, etc.)

Edited:
- `src/pages/dashboard/HomeownerDashboard.tsx` — wire "Find Services" → `/services`, "Book Now" → `/book`
- `src/pages/services/ServiceDetailPage.tsx` & `SubServiceDetailPage.tsx` — "Book Now" → `/book?subService={id}` (guarded)
- `src/pages/dashboard/ProviderDashboard.tsx` — add "Jobs" header link + notifications bell
- `src/routes/login.tsx` — accept `?redirect=` and honor it after sign-in

## Out of scope (intentionally)

- Real payment processing (UI only, mock Confirm & Pay)
- Real-time websocket — provider sees new jobs on page refresh / polling
- Map preview (decorative card only)

Confirm and I'll ship it. The DB migration runs first (separate approval step), then all the code.
