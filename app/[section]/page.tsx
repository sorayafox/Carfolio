import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { maintenanceStatus } from "@/lib/calculations";
import AppShell from "@/components/AppShell";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
const sections = ["dashboard","garage","vehicle","maintenance","car-guide","conditions","owner-tools","service-history","concerns","expenses","documents","timeline","health","settings"];
export default async function SectionPage({params}:{params:Promise<{section:string}>}) {
  const {section}=await params; if(!sections.includes(section)) notFound();
  const vehicleList=await prisma.vehicle.findMany({select:{id:true,nickname:true,year:true,make:true,model:true,color:true,currentMileage:true},orderBy:{createdAt:"asc"}});const activeId=Number((await cookies()).get("carfolio-active-vehicle")?.value);const requested=vehicleList.some(item=>item.id===activeId)?activeId:vehicleList[0]?.id;
  const vehicle = requested?await prisma.vehicle.findUnique({where:{id:requested},include:{maintenance:true,services:{orderBy:{serviceDate:"desc"}},concerns:{orderBy:{dateFirstNoticed:"desc"}},expenses:{orderBy:{date:"desc"}},documents:{orderBy:{issueDate:"desc"}},events:{orderBy:{date:"desc"}}}}):null;
  if(!vehicle) return <main className="empty">Run <code>npm run db:seed</code> to create the demo garage.</main>;
  const data = {...vehicle, maintenance:vehicle.maintenance.map(m=>({...m,status:maintenanceStatus(m,vehicle.currentMileage)}))};
  return <AppShell initial={JSON.parse(JSON.stringify(data))} vehicles={vehicleList} section={section}/>;
}
