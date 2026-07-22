import { NextResponse } from "next/server";
import { ollamaModel,ollamaStatus } from "@/lib/ollama";
import { prisma } from "@/lib/prisma";
export async function GET(){const manual=await prisma.manualDocument.findUnique({where:{manualCode:"OM02684U"},select:{pageCount:true,importedAt:true}});try{return NextResponse.json({...await ollamaStatus(),manual})}catch{return NextResponse.json({available:false,installed:false,model:ollamaModel,manual})}}
