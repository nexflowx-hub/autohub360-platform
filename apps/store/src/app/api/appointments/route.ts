import { NextResponse } from 'next/server';
import { appointmentSchema } from '@autohub360/commerce';
import { clientIp, rateLimit } from '@autohub360/integrations';
import { supabaseServiceRole } from '@autohub360/auth/server';

export const runtime = 'nodejs';

const TIMES = ['09:00', '11:00', '14:00', '16:00'] as const;

interface Slot {
  id: string;
  date: string;
  time: string;
  weekday: string;
}

function nextWeekdayDates(count: number): string[] {
  const dates: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1); // bookings start tomorrow
  while (dates.length < count) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(d.toISOString().slice(0, 10));
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

/** GET ?service=… → deterministic demo slots (next 14 weekdays × 4 daily times). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service') ?? 'instalacao-geral';

  const dates = nextWeekdayDates(14);
  const slots: Slot[] = [];
  for (const date of dates) {
    for (const time of TIMES) {
      slots.push({
        id: `${service}_${date}_${time}`,
        date,
        time,
        weekday: WEEKDAYS[new Date(`${date}T12:00:00`).getDay()] ?? '',
      });
    }
  }

  return NextResponse.json({
    ok: true,
    demo: true,
    service,
    slots: slots.map((s) => ({ ...s, date: formatDateLabel(s.date, s.weekday) })),
  });
}

function formatDateLabel(iso: string, weekday: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m} (${weekday})`;
}

/** POST — register an appointment request (schema-validated, rate-limited). */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`appointments:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Muitas solicitações em sequência. Aguarde um instante.' },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Requisição inválida.' }, { status: 400 });
  }

  const parsed = appointmentSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dados do agendamento inválidos. Revise o formulário.' },
      { status: 422 },
    );
  }
  const data = parsed.data;

  const appointmentId = `APT${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0')}`;

  // Persistence is best-effort while the services tables are not seeded in every environment.
  const db = supabaseServiceRole();
  if (db) {
    try {
      const { data: serviceRow } = await db
        .from('installation_services')
        .select('id')
        .eq('slug', data.service)
        .maybeSingle();
      if (serviceRow) {
        await db.from('appointments').insert({
          service_id: serviceRow.id,
          customer_name: data.name,
          customer_phone: data.phone,
          vehicle: data.vehicle,
          status: 'requested',
          notes: data.notes ?? null,
          demo: true,
        });
      }
    } catch (error) {
      console.error('[appointments] insert skipped:', error instanceof Error ? error.message : error);
    }
  }

  return NextResponse.json({
    ok: true,
    appointmentId,
    demo: true,
    message:
      'Solicitação registrada em modo demonstração. O parceiro Generoso Auto Center confirma data e horário pelo WhatsApp.',
  });
}
