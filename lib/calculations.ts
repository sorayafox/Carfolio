export type Dueable = { nextDueMileage: number | null; nextDueDate: Date | null };
export function maintenanceStatus(item: Dueable, mileage: number, now = new Date()) {
  const miles = item.nextDueMileage == null ? Infinity : item.nextDueMileage - mileage;
  const days = item.nextDueDate == null ? Infinity : Math.ceil((item.nextDueDate.getTime() - now.getTime()) / 86400000);
  if (miles < 0 || days < 0) return "Overdue";
  if (miles <= 100 || days <= 7) return "Due Now";
  if (miles <= 1000 || days <= 30) return "Due Soon";
  return "Up to Date";
}
export const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
