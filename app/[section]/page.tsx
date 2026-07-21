import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { maintenanceStatus } from "@/lib/calculations";
import AppShell from "@/components/AppShell";
export const dynamic = "force-dynamic";
const sections = ["dashboard","garage","vehicle","maintenance","car-guide","conditions","service-history","concerns","expenses","documents","timeline","settings"];
export default async function SectionPage({params}:{params:Promise<{section:string}>}) {
  const {section}=await params; if(!sections.includes(section)) notFound();
  const vehicle = await prisma.vehicle.findFirst({include:{maintenance:true,services:{orderBy:{serviceDate:"desc"}},concerns:{orderBy:{dateFirstNoticed:"desc"}},expenses:{orderBy:{date:"desc"}},documents:{orderBy:{issueDate:"desc"}},events:{orderBy:{date:"desc"}}}});
  if(!vehicle) return <main className="empty">Run <code>npm run db:seed</code> to create the demo garage.</main>;
  const data = {...vehicle, maintenance:vehicle.maintenance.map(m=>({...m,status:maintenanceStatus(m,vehicle.currentMileage)}))};
  return <AppShell initial={JSON.parse(JSON.stringify(data))} section={section}/>;
}
