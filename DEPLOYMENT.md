# Deployment Guide

## Best option for this app

For the first production version, this stack is practical:

- `Vercel` for web hosting
- `Supabase` for database and login
- `Stripe` for payments in AUD
- `LiveKit Cloud` for audio lesson rooms

## Deployment steps

1. Create a GitHub repository and push this project.
2. Create a Vercel account and import the repository.
3. Add environment variables in Vercel for Stripe, Supabase, and LiveKit.
4. Deploy the app.
5. Connect your domain name.

## Recommended environment variables

```env
NEXT_PUBLIC_APP_NAME=BrightPath Tutors
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

## What still needs implementation before full launch

- real login and account roles
- actual payment checkout
- booking calendar
- private lesson rooms
- synced whiteboard data
- lesson notes and homework storage

## Current local routes to test

- `/`
- `/auth`
- `/dashboard`
- `/book`
- `/classroom`
- `/api/stripe/webhook`
