import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { addMonths } from "date-fns";

export async function POST(req: Request) {
  const { id, ids, date, mileage, cost, provider } = await req.json();
  const itemIds = ids ? String(ids).split(",").map(Number).filter(Number.isInteger) : [Number(id)];
  if (!itemIds.length) return NextResponse.json({ error: "Select at least one maintenance item" }, { status: 400 });

  const items = await prisma.maintenanceItem.findMany({ where: { id: { in: itemIds } } });
  if (items.length !== itemIds.length) return NextResponse.json({ error: "A selected maintenance item could not be found" }, { status: 404 });

  const completedDate = new Date(date);
  const odometer = Number(mileage);
  const visitTotal = Number(cost) || 0;
  const allocatedCost = visitTotal / items.length;
  const vehicleId = items[0].vehicleId;

  await prisma.$transaction([
    ...items.map((item) => prisma.maintenanceItem.update({
      where: { id: item.id },
      data: {
        lastCompletedDate: completedDate,
        lastCompletedMileage: odometer,
        nextDueMileage: item.intervalMiles ? odometer + item.intervalMiles : null,
        nextDueDate: item.intervalMonths ? addMonths(completedDate, item.intervalMonths) : null,
      },
    })),
    ...items.map((item) => prisma.serviceRecord.create({ data: {
      vehicleId, maintenanceItemId: item.id, title: item.title, category: item.category,
      serviceDate: completedDate, mileage: odometer, provider, cost: allocatedCost,
      description: item.description, notes: items.length > 1 ? `Completed during a ${items.length}-item service visit.` : "Completed from maintenance schedule.",
    }})),
    prisma.expense.create({ data: {
      vehicleId, title: items.length > 1 ? `${items.length}-item maintenance visit` : items[0].title,
      category: "Maintenance", amount: visitTotal, date: completedDate, mileage: odometer, vendor: provider,
      notes: `Created automatically for: ${items.map((item) => item.title).join(", ")}.`,
    }}),
    prisma.timelineEvent.create({ data: {
      vehicleId, type: "service", title: items.length > 1 ? `${items.length} maintenance items completed` : `${items[0].title} completed`,
      description: `${items.map((item) => item.title).join(", ")} completed by ${provider}. Next due dates recalculated.`,
      date: completedDate, mileage: odometer, amount: visitTotal,
    }}),
  ]);
  return NextResponse.json({ ok: true, completed: items.length });
}
