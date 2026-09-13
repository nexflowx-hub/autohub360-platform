import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hasAdminSession } from '@/lib/admin-session';
import { backendAdminFetch } from '@/lib/backend-admin';

const schema=z.object({code:z.string().min(2).max(120),status:z.enum(['draft','active','paused'])});

export async function POST(request:Request){
  if(!(await hasAdminSession()))return NextResponse.json({ok:false},{status:401});
  const p=schema.safeParse(await request.json().catch(()=>null));
  if(!p.success)return NextResponse.json({ok:false,error:'Dados inválidos.'},{status:422});
  try{
    await backendAdminFetch(`/api/v1/admin/automations/rules/${encodeURIComponent(p.data.code)}`,{method:'PATCH',body:JSON.stringify({status:p.data.status})});
    return NextResponse.json({ok:true});
  }catch(error){
    const status=typeof error==='object'&&error&&'status' in error?Number((error as {status?:number}).status||500):500;
    return NextResponse.json({ok:false,error:'Falha no backend AutoHub360.'},{status});
  }
}
