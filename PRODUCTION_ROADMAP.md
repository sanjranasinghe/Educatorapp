# Production Roadmap

## Release phases

### Phase 1

- create Supabase project
- run the SQL in `supabase/schema.sql`
- add auth and profile creation
- protect `/dashboard`

### Phase 2

- add Stripe keys to `.env.local`
- test `/book`
- add Stripe webhook to mark bookings as `paid`

### Phase 3

- create LiveKit Cloud project
- add room token generation keys
- create lesson room names from booking ids
- send room join links after payment

### Phase 4

- build tutor availability management
- build admin dashboard
- add lesson notes and homework
- test full booking to classroom flow
