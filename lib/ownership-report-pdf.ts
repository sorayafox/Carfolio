type RecordValue = Record<string, any>;

const clean = (value: unknown) => String(value ?? "-").replace(/[^\x20-\x7E]/g, "-");
const escapePdf = (value: unknown) => clean(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const short = (value: unknown, limit: number) => { const text = clean(value).replace(/\s+/g, " ").trim(); return text.length > limit ? `${text.slice(0, limit - 3)}...` : text; };
const when = (value: unknown) => value ? new Date(String(value)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-";
const miles = (value: unknown) => value == null ? "-" : `${Number(value).toLocaleString("en-US")} mi`;

export function createOwnershipReportPdf(v: RecordValue) {
  const pages: string[][] = []; let commands: string[] = []; let y = 0;
  const text = (value: unknown, x: number, baseline: number, size = 9, bold = false, color = "0.11 0.16 0.2") => commands.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${color} rg 1 0 0 1 ${x} ${baseline} Tm (${escapePdf(value)}) Tj ET`);
  const rect = (x: number, bottom: number, width: number, height: number, color: string) => commands.push(`q ${color} rg ${x} ${bottom} ${width} ${height} re f Q`);
  const line = (x1: number, baseline: number, x2: number, color = "0.86 0.89 0.91") => commands.push(`q ${color} RG 0.7 w ${x1} ${baseline} m ${x2} ${baseline} l S Q`);
  const beginPage = (first = false) => { commands = []; y = first ? 614 : 716; if (!first) { text("CARFOLIO SERVICE BRIEF", 48, 748, 10, true, "0.12 0.35 0.55"); line(48, 736, 564); } };
  const endPage = () => pages.push(commands);
  const pageBreak = () => { endPage(); beginPage(); };
  const ensure = (height: number) => { if (y - height < 64) pageBreak(); };
  const section = (title: string, sub: string) => { ensure(58); y -= 10; text(title.toUpperCase(), 48, y, 11, true, "0.12 0.35 0.55"); text(sub, 564 - Math.min(250, clean(sub).length * 4.3), y, 8, false, "0.4 0.47 0.51"); y -= 12; line(48, y, 564, "0.72 0.81 0.87"); y -= 15; };
  const empty = (message: string) => { ensure(34); rect(48, y - 24, 516, 31, "0.95 0.97 0.98"); text(message, 60, y - 11, 9, false, "0.35 0.43 0.48"); y -= 42; };
  const serviceRow = (title: string, meta: string, detail = "", tone: "normal" | "warning" | "danger" = "normal") => { const height = detail ? 47 : 35; ensure(height); const fill = tone === "danger" ? "0.99 0.91 0.91" : tone === "warning" ? "1 0.96 0.86" : "0.96 0.97 0.98"; rect(48, y - height + 7, 516, height - 2, fill); if (tone !== "normal") rect(48, y - height + 7, 4, height - 2, tone === "danger" ? "0.75 0.22 0.25" : "0.87 0.57 0.12"); text(short(title, 55), 60, y - 10, 9.5, true); text(short(meta, 44), 552 - Math.min(190, clean(meta).length * 4.5), y - 10, 8, true, tone === "danger" ? "0.62 0.18 0.2" : tone === "warning" ? "0.55 0.35 0.05" : "0.35 0.43 0.48"); if (detail) text(short(detail, 105), 60, y - 27, 8, false, "0.34 0.41 0.45"); y -= height; };

  const maintenance = [...(v.maintenance || [])].map((item: RecordValue) => { const remaining = item.nextDueMileage == null ? Infinity : Number(item.nextDueMileage) - Number(v.currentMileage); const status = item.status || (remaining < 0 ? "Overdue" : remaining <= 100 ? "Due Now" : remaining <= 1000 ? "Due Soon" : "Up to Date"); return { ...item, status }; });
  const attention = maintenance.filter((item: RecordValue) => item.status !== "Up to Date");
  const upcoming = maintenance.filter((item: RecordValue) => item.status === "Up to Date").sort((a: RecordValue, b: RecordValue) => (a.nextDueMileage || Infinity) - (b.nextDueMileage || Infinity)).slice(0, 6);
  const concerns = (v.concerns || []).filter((item: RecordValue) => item.status !== "Resolved");
  const services = [...(v.services || [])].sort((a: RecordValue, b: RecordValue) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()).slice(0, 10);
  const lastService = services[0];

  beginPage(true);
  rect(0, 650, 612, 142, "0.08 0.23 0.36");
  text("CARFOLIO", 48, 755, 9, true, "0.59 0.79 0.93");
  text("Service brief", 48, 716, 25, true, "1 1 1");
  text(`${v.nickname} - ${v.year} ${v.make} ${v.model} ${v.trim}`, 48, 690, 11, false, "0.88 0.94 0.98");
  text(`Prepared ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, 48, 671, 8, false, "0.67 0.79 0.87");
  rect(48, 566, 516, 58, "0.94 0.97 0.98");
  text("ODOMETER", 62, 602, 7, true, "0.35 0.49 0.58"); text(miles(v.currentMileage), 62, 582, 14, true);
  text("VIN", 220, 602, 7, true, "0.35 0.49 0.58"); text(short(v.vin, 24), 220, 582, 11, true);
  text("OPEN ITEMS", 440, 602, 7, true, "0.35 0.49 0.58"); text(`${attention.length} service / ${concerns.length} observed`, 440, 582, 10, true);
  y = 538;
  section("Needs attention", "Due and approaching care");
  if (!attention.length) empty("No due or approaching maintenance in the saved schedule.");
  attention.forEach((item: RecordValue) => serviceRow(item.title, `${item.status} - ${item.nextDueMileage ? miles(item.nextDueMileage) : when(item.nextDueDate)}`, short(item.description, 100), item.status === "Overdue" || item.status === "Due Now" ? "danger" : "warning"));
  section("Active observations", "Owner-reported, not confirmed defects");
  if (!concerns.length) empty("No unresolved owner observations.");
  concerns.forEach((item: RecordValue) => serviceRow(item.title, `${item.severity} - ${item.status}`, short(item.symptoms, 105), item.severity === "Urgent" || item.severity === "High" ? "danger" : "warning"));
  section("Recent service", `Latest ${services.length} saved records`);
  if (!services.length) empty("No service history has been recorded.");
  services.forEach((item: RecordValue) => serviceRow(item.title, `${when(item.serviceDate)} - ${miles(item.mileage)}`, item.provider ? `Provider: ${short(item.provider, 70)}` : ""));
  section("Upcoming maintenance", "Next saved mileage limits");
  if (!upcoming.length) empty("No additional mileage-based maintenance is scheduled.");
  upcoming.forEach((item: RecordValue) => serviceRow(item.title, item.nextDueMileage ? miles(item.nextDueMileage) : when(item.nextDueDate), item.intervalMiles ? `Interval: ${miles(item.intervalMiles)}` : ""));
  ensure(54); line(48, y, 564); y -= 17; text("FOR THE SERVICE ADVISOR", 48, y, 8, true, "0.12 0.35 0.55"); y -= 15; text(lastService ? `Latest recorded visit: ${when(lastService.serviceDate)} at ${miles(lastService.mileage)}.` : "No previous visit is recorded.", 48, y, 8.5); y -= 15; text("Please verify due items and owner observations against the vehicle and Toyota service information.", 48, y, 8.5);
  endPage();

  pages.forEach((page, index) => { page.push(`q 0.9 0.92 0.93 RG 0.6 w 48 42 m 564 42 l S Q`, `BT /F1 7 Tf 0.42 0.48 0.52 rg 1 0 0 1 48 25 Tm (Generated from owner-entered Carfolio records - not a diagnostic inspection.) Tj ET`, `BT /F1 7 Tf 0.42 0.48 0.52 rg 1 0 0 1 525 25 Tm (Page ${index + 1}/${pages.length}) Tj ET`); });

  const objects: string[] = ["<< /Type /Catalog /Pages 2 0 R >>", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"]; const pageRefs: string[] = [];
  pages.forEach(page => { const pageId = objects.length + 1; const contentId = pageId + 1; pageRefs.push(`${pageId} 0 R`); const stream = page.join("\n"); objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`); }); objects[1] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${pageRefs.length} >>`;
  let pdf = "%PDF-1.4\n"; const offsets = [0]; objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }); const xref = pdf.length; pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`; offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; }); pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}
