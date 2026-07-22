import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){const {id}=await req.json();const vehicleId=Number(id);if(!Number.isInteger(vehicleId)||!await prisma.vehicle.findUnique({where:{id:vehicleId},select:{id:true}}))return NextResponse.json({error:"Vehicle not found"},{status:404});const response=NextResponse.json({ok:true});response.cookies.set("carfolio-active-vehicle",String(vehicleId),{httpOnly:true,sameSite:"lax",path:"/",maxAge:31536000});return response;}
