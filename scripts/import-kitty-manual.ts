import { execFile } from "node:child_process";
import { unlink,writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";

const manual={manualCode:"OM02684U",title:"Toyota 2024 Corolla Owner's Manual - USA and Canada",sourceUrl:"https://assets.sia.toyota.com/publications/en/om-s/OM02684U/pdf/OM02684U.pdf"};
const temporaryPath="/tmp/carfolio-OM02684U.pdf";
const run=promisify(execFile);

async function main(){
  console.log("Downloading the official Toyota manual...");
  const response=await fetch(manual.sourceUrl);if(!response.ok)throw new Error(`Toyota download returned ${response.status}`);
  await writeFile(temporaryPath,Buffer.from(await response.arrayBuffer()));
  console.log("Extracting page text locally...");
  const {stdout}=await run("python3",["scripts/extract-pdf.py",temporaryPath],{maxBuffer:30*1024*1024});
  const pages=JSON.parse(stdout) as Array<{pageNumber:number;text:string}>;if(pages.length<100)throw new Error("The manual extraction returned too few pages.");
  await prisma.$transaction(async transaction=>{
    const document=await transaction.manualDocument.upsert({where:{manualCode:manual.manualCode},create:{...manual,pageCount:pages.length},update:{title:manual.title,sourceUrl:manual.sourceUrl,pageCount:pages.length,importedAt:new Date()}});
    await transaction.manualPage.deleteMany({where:{documentId:document.id}});
    await transaction.manualPage.createMany({data:pages.map(page=>({...page,documentId:document.id}))});
  });
  console.log(`Indexed ${pages.length} Toyota manual pages in SQLite.`);
}

main().finally(async()=>{await unlink(temporaryPath).catch(()=>undefined);await prisma.$disconnect()});
