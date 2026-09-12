import { handleAIChatRequest } from '@autohub360/integrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return handleAIChatRequest(request);
}
