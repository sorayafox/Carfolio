type RecordLike = Record<string, any>;

export type HealthCategory = {
  id: string;
  label: string;
  score: number;
  weight: number;
  summary: string;
  href: string;
  issues: string[];
};

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function calculateVehicleHealth(vehicle: RecordLike, now = new Date()) {
  const maintenance = vehicle.maintenance ?? [];
  const concerns = (vehicle.concerns ?? []).filter((item: RecordLike) => item.status !== "Resolved");
  const documents = vehicle.documents ?? [];
  const events = vehicle.events ?? [];

  const maintenanceCounts = maintenance.reduce((counts: Record<string, number>, item: RecordLike) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const maintenanceScore = clamp(100 - (maintenanceCounts.Overdue ?? 0) * 25 - (maintenanceCounts["Due Now"] ?? 0) * 14 - (maintenanceCounts["Due Soon"] ?? 0) * 5);
  const maintenanceIssues = [
    maintenanceCounts.Overdue ? `${maintenanceCounts.Overdue} overdue maintenance item${maintenanceCounts.Overdue === 1 ? "" : "s"}` : "",
    maintenanceCounts["Due Now"] ? `${maintenanceCounts["Due Now"]} item${maintenanceCounts["Due Now"] === 1 ? " is" : "s are"} due now` : "",
    maintenanceCounts["Due Soon"] ? `${maintenanceCounts["Due Soon"]} item${maintenanceCounts["Due Soon"] === 1 ? " is" : "s are"} approaching` : "",
  ].filter(Boolean);

  const severityPenalty: Record<string, number> = { Low: 4, Medium: 10, High: 20, Urgent: 35 };
  const concernScore = clamp(100 - concerns.reduce((total: number, concern: RecordLike) => total + (severityPenalty[concern.severity] ?? 5), 0));
  const concernIssues = concerns.map((concern: RecordLike) => `${concern.severity}: ${concern.title}`);

  const expiring = documents.map((document: RecordLike) => {
    if (!document.expirationDate) return null;
    const days = Math.ceil((new Date(document.expirationDate).getTime() - now.getTime()) / 86400000);
    return { ...document, days };
  }).filter(Boolean) as RecordLike[];
  const expiredCount = expiring.filter(item => item.days < 0).length;
  const soonCount = expiring.filter(item => item.days >= 0 && item.days <= 30).length;
  const coverageScore = clamp(100 - expiredCount * 30 - soonCount * 10);
  const coverageIssues = expiring.filter(item => item.days <= 30).map(item => item.days < 0 ? `${item.title} expired ${Math.abs(item.days)} days ago` : `${item.title} expires in ${item.days} days`);

  const lastMileage = events.find((event: RecordLike) => event.type === "mileage");
  const mileageAge = lastMileage ? Math.floor((now.getTime() - new Date(lastMileage.date).getTime()) / 86400000) : Infinity;
  const recordsScore = clamp(lastMileage ? 100 - (mileageAge > 90 ? 20 : mileageAge > 30 ? 8 : 0) : 70);
  const recordIssues = !lastMileage ? ["No mileage update has been recorded"] : mileageAge > 30 ? [`Mileage was last updated ${mileageAge} days ago`] : [];

  const categories: HealthCategory[] = [
    { id: "maintenance", label: "Maintenance readiness", score: maintenanceScore, weight: 45, summary: maintenanceIssues[0] || "Scheduled care is under control.", href: "/maintenance", issues: maintenanceIssues },
    { id: "concerns", label: "Open observations", score: concernScore, weight: 25, summary: concernIssues[0] || "No unresolved observations are affecting the score.", href: "/concerns", issues: concernIssues },
    { id: "coverage", label: "Coverage & documents", score: coverageScore, weight: 15, summary: coverageIssues[0] || "Tracked documents are current.", href: "/documents", issues: coverageIssues },
    { id: "records", label: "Record freshness", score: recordsScore, weight: 15, summary: recordIssues[0] || "Mileage and activity records are current.", href: "/timeline", issues: recordIssues },
  ];
  const score = clamp(categories.reduce((total, category) => total + category.score * (category.weight / 100), 0));
  const label = score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 60 ? "Needs attention" : "Action recommended";
  return { score, label, categories, issueCount: categories.reduce((total, category) => total + category.issues.length, 0) };
}
