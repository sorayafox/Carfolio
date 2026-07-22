import { prisma } from "@/lib/prisma";

const stopWords=new Set(["about","after","again","also","because","before","being","between","change","could","does","from","have","how","into","kitty","manual","often","should","that","their","there","these","they","this","those","vehicle","what","when","where","which","while","with","would","your"]);

function normalizeTerm(term:string){return term.endsWith("s")&&term.length>4?term.slice(0,-1):term}
function searchTerms(question:string){return Array.from(new Set(question.toLowerCase().match(/[a-z0-9-]{3,}/g)?.filter(term=>!stopWords.has(term)).map(normalizeTerm)??[])).slice(0,8)}
function excerpt(text:string,terms:string[]){const normalized=text.replace(/\s+/g," ").trim();const lower=normalized.toLowerCase();const positions=terms.map(term=>lower.indexOf(term)).filter(position=>position>=0);const center=positions.length?Math.min(...positions):0;const start=Math.max(0,center-450);const end=Math.min(normalized.length,start+1800);return `${start>0?"…":""}${normalized.slice(start,end)}${end<normalized.length?"…":""}`}

export async function searchKittyManual(question:string,limit=4){
  const document=await prisma.manualDocument.findUnique({where:{manualCode:"OM02684U"}});if(!document)return [];
  const terms=searchTerms(question);if(!terms.length)return [];
  const phrases=terms.slice(0,-1).map((term,index)=>`${term} ${terms[index+1]}`);
  const queries=[...phrases,...terms];
  const groups=await Promise.all(queries.map(term=>prisma.manualPage.findMany({where:{documentId:document.id,text:{contains:term}},select:{pageNumber:true,text:true},take:12})));
  const pages=Array.from(new Map(groups.flat().map(page=>[page.pageNumber,page])).values());
  return pages.map(page=>{const lower=page.text.toLowerCase();const termScore=terms.reduce((total,term)=>total+Math.min(4,lower.split(term).length-1),0);const phraseScore=phrases.reduce((total,phrase)=>total+(lower.includes(phrase)?12:0),0);return {pageNumber:page.pageNumber,score:termScore+phraseScore,text:excerpt(page.text,[...phrases,...terms]),sourceUrl:`${document.sourceUrl}#page=${page.pageNumber}`}}).sort((a,b)=>b.score-a.score||a.pageNumber-b.pageNumber).slice(0,limit);
}
