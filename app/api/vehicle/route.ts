import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data=await req.json();const required=["nickname","year","make","model","vin","color","licensePlate","fuelType","transmission","purchaseDate","currentMileage","seller"];
  if(required.some(field=>!String(data[field]??"").trim()))return NextResponse.json({error:"Please complete the required vehicle and ownership details."},{status:400});
  const currentMileage=Number(data.currentMileage);const purchaseMileage=Number(data.purchaseMileage||currentMileage);if(!Number.isFinite(currentMileage)||currentMileage<0)return NextResponse.json({error:"Enter a valid current mileage."},{status:400});if(!Number.isFinite(purchaseMileage)||purchaseMileage>currentMileage)return NextResponse.json({error:"Purchase mileage cannot be above the current odometer."},{status:400});if(String(data.vin).trim().length!==17)return NextResponse.json({error:"Enter the complete 17-character VIN."},{status:400});data.purchaseMileage=purchaseMileage;
  try{const vehicle=await prisma.$transaction(async tx=>{const created=await tx.vehicle.create({data:{nickname:String(data.nickname).trim(),year:Number(data.year),make:String(data.make).trim(),model:String(data.model).trim(),trim:String(data.trim||"Not specified").trim(),color:String(data.color).trim(),vin:String(data.vin).trim().toUpperCase(),licensePlate:String(data.licensePlate).trim(),fuelType:String(data.fuelType).trim(),transmission:String(data.transmission).trim(),purchaseDate:new Date(data.purchaseDate),purchasePrice:Number(data.purchasePrice||0),purchaseMileage:Number(data.purchaseMileage||currentMileage),currentMileage,seller:String(data.seller).trim(),notes:String(data.notes||"").trim(),warrantyEndDate:data.warrantyEndDate?new Date(data.warrantyEndDate):null,warrantyEndMileage:data.warrantyEndMileage?Number(data.warrantyEndMileage):null}});const starter=[["Engine oil & filter","Oil and Fluids",5000,6],["Tire rotation","Tires",7500,12],["Brake inspection","Brakes",12000,12],["Cabin air filter","Filters",15000,18]];for(const [title,category,intervalMiles,intervalMonths] of starter)await tx.maintenanceItem.create({data:{vehicleId:created.id,title:String(title),category:String(category),description:`Review ${String(title).toLowerCase()} condition and service need.`,intervalMiles:Number(intervalMiles),intervalMonths:Number(intervalMonths),nextDueMileage:currentMileage+Number(intervalMiles),nextDueDate:new Date(new Date(data.purchaseDate).setMonth(new Date(data.purchaseDate).getMonth()+Number(intervalMonths))),notes:"Carfolio starter estimate - replace with the owner manual, maintenance monitor, or dealer recommendation."}});await tx.timelineEvent.create({data:{vehicleId:created.id,type:"purchase",title:`${created.nickname} joined the garage`,description:"Vehicle profile created through first-time setup.",date:new Date(data.purchaseDate),mileage:currentMileage}});return created});const response=NextResponse.json(vehicle,{status:201});response.cookies.set("carfolio-active-vehicle",String(vehicle.id),{httpOnly:true,sameSite:"lax",path:"/",maxAge:31536000});return response}catch(error:any){return NextResponse.json({error:error?.code==="P2002"?"That VIN is already in your garage.":"Could not add this vehicle."},{status:400})}
}

export async function PUT(req: Request) {
  const { id, ...data } = await req.json();
  const vehicleId = Number(id);
  if (!Number.isInteger(vehicleId)) return NextResponse.json({ error: "Invalid vehicle" }, { status: 400 });

  const required = ["nickname", "make", "model", "trim", "color", "vin", "licensePlate", "fuelType", "transmission", "seller"];
  if (required.some((field) => !String(data[field] ?? "").trim())) {
    return NextResponse.json({ error: "Please complete all required fields" }, { status: 400 });
  }

  const purchaseMileage = Number(data.purchaseMileage);
  const currentMileage = Number(data.currentMileage);
  if (currentMileage < purchaseMileage) {
    return NextResponse.json({ error: "Current mileage cannot be below purchase mileage" }, { status: 400 });
  }

  const before = await prisma.vehicle.findUniqueOrThrow({ where: { id: vehicleId } });
  const updated = await prisma.vehicle.update({
    where: { id: vehicleId },
    data: {
      nickname: String(data.nickname).trim(), year: Number(data.year), make: String(data.make).trim(),
      model: String(data.model).trim(), trim: String(data.trim).trim(), color: String(data.color).trim(),
      vin: String(data.vin).trim(), licensePlate: String(data.licensePlate).trim(), fuelType: String(data.fuelType).trim(),
      transmission: String(data.transmission).trim(), purchaseDate: new Date(data.purchaseDate), purchasePrice: Number(data.purchasePrice),
      purchaseMileage, currentMileage, seller: String(data.seller).trim(), notes: String(data.notes ?? "").trim(),
      warrantyEndDate: data.warrantyEndDate ? new Date(data.warrantyEndDate) : null,
      warrantyEndMileage: data.warrantyEndMileage ? Number(data.warrantyEndMileage) : null,
    },
  });

  await prisma.timelineEvent.create({
    data: {
      vehicleId, type: "vehicle", title: "Vehicle profile updated",
      description: before.nickname !== updated.nickname ? `${before.nickname} was renamed ${updated.nickname}.` : "Vehicle and ownership details were updated.",
      date: new Date(), mileage: updated.currentMileage,
    },
  });
  return NextResponse.json(updated);
}
