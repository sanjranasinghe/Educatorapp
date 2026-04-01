const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "BrightPath Tutors",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  livekitApiKey: process.env.LIVEKIT_API_KEY,
  livekitApiSecret: process.env.LIVEKIT_API_SECRET,
  livekitUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL
};

export const serviceStatus = {
  supabase: Boolean(env.supabaseUrl && env.supabaseAnonKey),
  stripe: Boolean(env.stripeSecretKey && env.stripePublishableKey),
  livekit: Boolean(env.livekitApiKey && env.livekitApiSecret && env.livekitUrl)
};

export { env };
