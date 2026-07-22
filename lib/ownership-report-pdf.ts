type RecordValue = Record<string, any>;

const clean = (value: unknown) => String(value ?? "-").replace(/[^\x20-\x7E]/g, "-");
const escapePdf = (value: string) => clean(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

function wrap(value: unknown, width = 88) {
  const words = clean(value).split(/\s+/); const lines: string[] = []; let line = "";
  for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > width && line) { lines.push(line); line = word; } else line = next; }
  if (line) lines.push(line); return lines;
}

export function createOwnershipReportPdf(v: RecordValue) {
  const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;
  const when = (d: unknown) => d ? new Date(String(d)).toLocaleDateString("en-US") : "-";
  const lines: { text: string; style?: "title" | "heading" | "muted" }[] = [];
  const heading = (text: string) => lines.push({ text, style: "heading" });
  const row = (label: string, value: unknown) => wrap(`${label}: ${clean(value)}`).forEach(text => lines.push({ text }));
  lines.push({ text: "CARFOLIO OWNERSHIP REPORT", style: "title" }, { text: `Generated ${new Date().toLocaleString("en-US")}`, style: "muted" });
  heading("VEHICLE"); row("Name", v.nickname); row("Vehicle", `${v.year} ${v.make} ${v.model} ${v.trim}`); row("VIN", v.vin); row("Current mileage", `${Number(v.currentMileage).toLocaleString()} mi`); row("Color", v.color);
  heading("MAINTENANCE"); (v.maintenance || []).forEach((m: RecordValue) => { row(m.title, `${m.status} | next ${m.nextDueMileage ? `${Number(m.nextDueMileage).toLocaleString()} mi` : when(m.nextDueDate)}`); });
  heading("SERVICE HISTORY"); (v.services || []).forEach((s: RecordValue) => row(when(s.serviceDate), `${s.title} | ${Number(s.mileage).toLocaleString()} mi | ${money(s.cost)} | ${s.provider}`));
  heading("OBSERVATIONS"); (v.concerns || []).forEach((c: RecordValue) => row(c.title, `${c.status} | ${c.severity} | ${c.symptoms}`));
  heading("EXPENSES"); (v.expenses || []).forEach((e: RecordValue) => row(when(e.date), `${e.title} | ${e.category} | ${money(e.amount)} | ${e.vendor}`));
  heading("DOCUMENTS"); (v.documents || []).forEach((d: RecordValue) => row(d.title, `${d.type} | ${d.provider} | expires ${when(d.expirationDate)} | ref ${d.referenceNumber || "-"}`));
  heading("OWNERSHIP TIMELINE"); (v.events || []).forEach((e: RecordValue) => row(when(e.date), `${e.title} | ${e.description}`));
  lines.push({ text: "Carfolio reflects saved owner records and is not a mechanical inspection or proof of recall completion.", style: "muted" });

  const chunks: typeof lines[] = []; let page: typeof lines = []; let used = 0;
  for (const line of lines) { const height = line.style === "title" ? 30 : line.style === "heading" ? 25 : 14; if (used + height > 670 && page.length) { chunks.push(page); page = []; used = 0; } page.push(line); used += height; }
  if (page.length) chunks.push(page);
  const objects: string[] = ["<< /Type /Catalog /Pages 2 0 R >>", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
  const pageRefs: string[] = [];
  chunks.forEach((chunk, index) => { const pageId = objects.length + 1; const contentId = pageId + 1; pageRefs.push(`${pageId} 0 R`); let y = 738; const commands = ["BT"];
    chunk.forEach(line => { const size = line.style === "title" ? 18 : line.style === "heading" ? 11 : 9; const font = line.style === "title" || line.style === "heading" ? "F2" : "F1"; y -= line.style === "title" ? 28 : line.style === "heading" ? 22 : 13; const color = line.style === "muted" ? "0.38 0.45 0.5" : line.style === "heading" ? "0.12 0.35 0.55" : "0.1 0.15 0.18"; commands.push(`/${font} ${size} Tf`, `${color} rg`, `1 0 0 1 54 ${y} Tm`, `(${escapePdf(line.text)}) Tj`); });
    commands.push("/F1 8 Tf", "0.45 0.5 0.55 rg", `1 0 0 1 520 30 Tm`, `(Page ${index + 1} of ${chunks.length}) Tj`, "ET"); const stream = commands.join("\n"); objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  objects[1] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${pageRefs.length} >>`;
  let pdf = "%PDF-1.4\n"; const offsets = [0]; objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }); const xref = pdf.length; pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`; offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; }); pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}
