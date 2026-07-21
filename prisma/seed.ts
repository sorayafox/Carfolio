import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  await db.timelineEvent.deleteMany(); await db.serviceRecord.deleteMany(); await db.maintenanceItem.deleteMany();
  await db.concern.deleteMany(); await db.expense.deleteMany(); await db.document.deleteMany(); await db.vehicle.deleteMany();
  const vehicle = await db.vehicle.create({ data: {
    nickname:"Kitty", year:2024, make:"Toyota", model:"Corolla Hybrid", trim:"LE", color:"Dark Grey",
    vin:"JTDBCMFE8R3018427", licensePlate:"9KAR214", fuelType:"Hybrid", transmission:"eCVT", purchaseDate:new Date("2024-06-14T12:00:00Z"),
    purchasePrice:28400, purchaseMileage:12, currentMileage:18450, seller:"Cedar Grove Toyota", notes:"Daily commuter; mostly highway miles. Keep receipts and service records here.", warrantyEndDate:new Date("2027-06-14T12:00:00Z"), warrantyEndMileage:36000,
  }});
  const maintenance = await Promise.all([
    ["Engine oil & filter","Oil and Fluids","Replace engine oil and filter.",5000,6,15012,"2026-04-02","2026-10-02",20012,95],
    ["Tire rotation","Tires","Rotate tires and inspect tread depth.",5000,6,15012,"2026-04-02","2026-10-02",20012,40],
    ["Cabin air filter","Filters","Inspect and replace cabin air filter.",15000,18,12020,"2026-01-10","2027-07-10",27020,55],
    ["Brake inspection","Brakes","Inspect pads, rotors and brake fluid.",10000,12,10018,"2025-10-15","2026-10-15",20018,80],
    ["Hybrid system inspection","Hybrid System","Inspect cooling intake and system health.",15000,12,15012,"2026-04-02","2027-04-02",30012,110],
  ].map(x => db.maintenanceItem.create({data:{vehicleId:vehicle.id,title:x[0] as string,category:x[1] as string,description:x[2] as string,intervalMiles:x[3] as number,intervalMonths:x[4] as number,lastCompletedMileage:x[5] as number,lastCompletedDate:new Date(x[6] as string),nextDueDate:new Date(x[7] as string),nextDueMileage:x[8] as number,estimatedCost:x[9] as number,notes:"General estimate—verify against the Toyota maintenance guide."}})));
  await db.serviceRecord.createMany({data:[
    {vehicleId:vehicle.id,maintenanceItemId:maintenance[0].id,title:"15k-mile oil service",category:"Oil and Fluids",serviceDate:new Date("2026-04-02"),mileage:15012,provider:"Northline Auto Care",cost:78.42,description:"Synthetic oil and filter replacement.",notes:"Multipoint inspection completed."},
    {vehicleId:vehicle.id,maintenanceItemId:maintenance[1].id,title:"Tire rotation",category:"Tires",serviceDate:new Date("2026-04-02"),mileage:15012,provider:"Northline Auto Care",cost:0,description:"Rotated all four tires.",notes:"Tread even; 7/32 remaining."},
    {vehicleId:vehicle.id,title:"10k scheduled service",category:"Inspection",serviceDate:new Date("2025-10-15"),mileage:10018,provider:"Cedar Grove Toyota",cost:126.8,description:"Inspection, fluid check and brake inspection.",notes:"No issues found."},
  ]});
  await db.concern.createMany({data:[
    {vehicleId:vehicle.id,title:"Occasional dash rattle",category:"Interior",severity:"Low",symptoms:"Light rattle over rough pavement near passenger-side dash.",dateFirstNoticed:new Date("2026-03-18"),mileageFirstNoticed:14220,status:"Monitoring",mechanicNotes:"User-recorded observation; not a confirmed defect."},
    {vehicleId:vehicle.id,title:"Monitor rear tire wear",category:"Tires",severity:"Low",symptoms:"Rear-left tread appears slightly lower than rear-right.",dateFirstNoticed:new Date("2026-06-07"),mileageFirstNoticed:17650,status:"Needs Inspection",mechanicNotes:"General item to monitor; measure at next rotation."},
  ]});
  await db.expense.createMany({data:[
    {vehicleId:vehicle.id,title:"15k-mile service",category:"Maintenance",amount:78.42,date:new Date("2026-04-02"),mileage:15012,vendor:"Northline Auto Care"},
    {vehicleId:vehicle.id,title:"Annual insurance premium",category:"Insurance",amount:1284,date:new Date("2026-06-14"),vendor:"Oak & Harbor Insurance"},
    {vehicleId:vehicle.id,title:"Registration renewal",category:"Registration",amount:284,date:new Date("2026-06-08"),vendor:"California DMV"},
    {vehicleId:vehicle.id,title:"All-weather cargo liner",category:"Accessories",amount:126,date:new Date("2025-11-21"),vendor:"Motoring Supply Co."},
  ]});
  await db.document.createMany({data:[
    {vehicleId:vehicle.id,title:"California Registration",type:"Registration",issueDate:new Date("2026-06-08"),expirationDate:new Date("2027-06-14"),provider:"California DMV",referenceNumber:"REG-84-2197"},
    {vehicleId:vehicle.id,title:"Auto Insurance Policy",type:"Insurance",issueDate:new Date("2026-06-14"),expirationDate:new Date("2026-12-14"),provider:"Oak & Harbor Insurance",referenceNumber:"OH-482119"},
    {vehicleId:vehicle.id,title:"Toyota Basic Warranty",type:"Warranty",issueDate:new Date("2024-06-14"),expirationDate:new Date("2027-06-14"),provider:"Toyota Motor Sales",referenceNumber:"VIN-linked"},
  ]});
  await db.timelineEvent.createMany({data:[
    {vehicleId:vehicle.id,type:"purchase",title:"Kitty joined the garage",description:"Purchased new from Cedar Grove Toyota.",date:new Date("2024-06-14"),mileage:12,amount:28400},
    {vehicleId:vehicle.id,type:"service",title:"10k scheduled service",description:"Inspection and fluid check completed.",date:new Date("2025-10-15"),mileage:10018,amount:126.8},
    {vehicleId:vehicle.id,type:"service",title:"15k-mile service",description:"Oil, filter and tire rotation completed.",date:new Date("2026-04-02"),mileage:15012,amount:78.42},
    {vehicleId:vehicle.id,type:"document",title:"Registration renewed",description:"Registration valid through June 2027.",date:new Date("2026-06-08"),amount:284},
    {vehicleId:vehicle.id,type:"mileage",title:"Mileage updated",description:"Current odometer reading recorded.",date:new Date("2026-07-18"),mileage:18450},
  ]});
}
main().finally(()=>db.$disconnect());
