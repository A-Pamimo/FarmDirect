import { config } from 'dotenv';

config();

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toNumber(process.env.PORT, 3000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? '',
  webhookSecret: process.env.WEBHOOK_SECRET ?? '',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? '',
  twilioFrom: process.env.TWILIO_FROM ?? '',
  smtpHost: process.env.SMTP_HOST ?? '',
  smtpPort: toNumber(process.env.SMTP_PORT, 587),
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:5173',
  apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:3000',
  demoSeed: process.env.DEMO_SEED !== 'false',
};

export const featureFlags = {
  stripeEnabled: Boolean(env.stripeSecretKey),
  smsEnabled: Boolean(env.twilioAccountSid && env.twilioAuthToken && env.twilioFrom),
  emailEnabled: Boolean(env.smtpHost && env.smtpUser && env.smtpPass),
};
