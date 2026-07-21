import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
