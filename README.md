# BrightPath Tutors MVP

This is a starter web app for an Australia-focused tutoring platform where students can:

- learn English and Maths
- buy one-hour lessons
- join an online audio lesson with a tutor
- use a shared board/pen during the class

## Recommended product stack

- Frontend: Next.js
- Styling: Tailwind CSS
- Payments: Stripe
- Database and auth: Supabase
- Audio rooms: LiveKit or Twilio
- Hosting: Vercel

## Production routes now included

- `/auth` for sign in and sign up
- `/dashboard` for student or tutor overview
- `/book` for lesson checkout flow
- `/classroom` for room token testing and whiteboard demo
- `/api/checkout` for Stripe checkout session creation
- `/api/livekit/token` for LiveKit room token generation
- `/api/health` for basic app status

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## What is included

- landing page for the tutoring business
- English and Maths subject sections
- tutor listing cards
- lesson packages
- booking form prototype
- classroom preview for audio + whiteboard

## Suggested next build phases

1. Add authentication for students and tutors
2. Add tutor availability and calendar booking
3. Add Stripe checkout for paid bookings
4. Add real-time audio rooms with LiveKit
5. Add shared whiteboard with drawing state sync
6. Add admin dashboard and lesson management
