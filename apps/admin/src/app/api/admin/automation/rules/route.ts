import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServiceRole } from '@autohub360/auth/server';
import { hasAdminSession } from '@/lib/admin-session';
const schema=z.object({code:z.string().min(2).max(120),status:z.enum(['draft','active','paused'])});
export async function POST(request:Request){if(!(await hasAdminSession()))return NextResponse.json({ok:false},{status:401});const p=schema.safeParse(await request.json().catch(()=>null));if(!p.success)return NextResponse.json({ok:false,error:'Dados inválidos.'},{status:422});const db=supabaseServiceRole();if(!db)return NextResponse.json({ok:false,error:'DB indisponível.'},{status:503});const {error}=await db.from('automation_rules').update({status:p.data.status,updated_at:new Date().toISOString()}).eq('code',p.data.code);return error?NextResponse.json({ok:false,error:error.message},{status:500}):NextResponse.json({ok:true});}
