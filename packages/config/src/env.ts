import { z } from 'zod';

/** Server env schema — never exposed to the browser bundle. */
export const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  PAYMENT_PROVIDER: z.string().optional(),
  PAYMENT_SECRET_KEY: z.string().optional(),
  PAYMENT_WEBHOOK_SECRET: z.string().optional(),
  SHIPPING_PROVIDER: z.string().optional(),
  SHIPPING_API_KEY: z.string().optional(),
  EMAIL_PROVIDER: z.string().optional(),
  EMAIL_API_KEY: z.string().optional(),
});

/** Public env schema — safe for the browser bundle. */
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default('https://eivqvrfsreaopzlvhadu.supabase.co'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional().default(''),
  NEXT_PUBLIC_TECH_URL: z.string().url().default('https://autohub360.tech'),
  NEXT_PUBLIC_STORE_URL: z.string().url().default('https://autohub360.store'),
  NEXT_PUBLIC_WHATSAPP_BR: z.string().default('5562991903462'),
  NEXT_PUBLIC_GA_ID: z.string().optional().default(''),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional().default(''),
  NEXT_PUBLIC_TIKTOK_PIXEL_ID: z.string().optional().default(''),
});
