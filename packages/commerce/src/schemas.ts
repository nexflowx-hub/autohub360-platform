import { z } from 'zod';

/** Checkout payload contract — validated server-side by the API route with the same schema. */
export const checkoutSchema = z.object({
  market: z.enum(['BR', 'EU']).default('BR'),
  customer: z.object({
    name: z.string().min(3).max(120),
    email: z.string().email(),
    phone: z.string().min(10).max(20),
    document: z.string().optional(),
  }),
  delivery: z.discriminatedUnion('method', [
    z.object({
      method: z.literal('nationwide'),
      cep: z.string().regex(/^\d{5}-?\d{3}$/),
      street: z.string().min(3),
      number: z.string().min(1),
      complement: z.string().optional(),
      district: z.string().min(2),
      city: z.string().min(2),
      state: z.string().min(2).max(2),
      option: z.enum(['standard', 'express']).default('standard'),
    }),
    z.object({ method: z.literal('pickup') }),
    z.object({
      method: z.literal('pickup_installation'),
      slotId: z.string().min(1),
      vehicle: z.string().min(2),
      serviceNotes: z.string().max(500).optional(),
    }),
  ]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().max(20),
        installation: z.boolean().default(false),
      }),
    )
    .min(1),
  paymentMethod: z.enum(['pix', 'credit', 'boleto']).default('pix'),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type CheckoutPayload = z.infer<typeof checkoutSchema>;

export const appointmentSchema = z.object({
  productSlug: z.string().optional(),
  productId: z.string().optional(),
  vehicle: z.string().min(2).max(120),
  service: z.string().min(2).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(3).max(120),
  phone: z.string().min(10).max(20),
  notes: z.string().max(500).optional(),
});

export type AppointmentPayload = z.infer<typeof appointmentSchema>;

export const contactSchema = z.object({
  department: z.enum(['contato', 'comercial', 'pro', 'parcerias', 'suporte', 'vendas', 'reclamacoes']).default('contato'),
  name: z.string().min(3).max(120),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(2000),
  /** Simple timestamp-based bot check. */
  formStartedAt: z.number().int().optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email(),
  source: z.string().max(60).optional(),
});

export type NewsletterPayload = z.infer<typeof newsletterSchema>;
