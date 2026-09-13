import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hasAdminSession } from '@/lib/admin-session';
import { backendAdminFetch } from '@/lib/backend-admin';

export const runtime='nodejs';
const schema=z.object({shipment:z.string().trim().min(3).max(120),status:z.enum(['created','labeled','in_transit','out_for_delivery','delivered','exception','returned']),title:z.string().trim().min(2).max(120),description:z.string().trim().max(800).optional(),location:z.string().trim().max(160).optional()});

type BackendResponse={success:boolean;publicCode?:string;error?:string};

export async function POST(request:Request){
  if(!(await hasAdminSession()))return NextResponse.json({ok:false,error:'Não autorizado.'},{status:401});
  const parsed=schema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({ok:false,error:'Dados inválidos.'},{status:422});
  try{
    const data=await backendAdminFetch<BackendResponse>('/api/v1/admin/shipments/events',{method:'POST',body:JSON.stringify({shipment:parsed.data.shipment,status:parsed.data.status,eventCode:parsed.data.status,title:parsed.data.title,description:parsed.data.description||undefined,location:parsed.data.location||undefined})});
    return NextResponse.json({ok:true,publicCode:data.publicCode});
  }catch(error){
    const status=typeof error==='object'&&error&&'status' in error?Number((error as {status?:number}).status||500):500;
    return NextResponse.json({ok:false,error:status===404?'Expedição não encontrada.':'Falha no backend AutoHub360.'},{status});
  }
}
