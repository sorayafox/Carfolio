import assert from "node:assert/strict";
import { after,test } from "node:test";
import { POST } from "../app/api/ai/chat/route";
import { prisma } from "../lib/prisma";

after(async()=>{await prisma.$disconnect()});

async function ask(question:string){
  const response=await POST(new Request("http://carfolio.local/api/ai/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:question}]})}));
  return {status:response.status,body:await response.json()};
}

test("cold-weather PSI guidance offers the Conditions page even with a tire typo",async()=>{
  const {status,body}=await ask("It is cold today, should I check my ires psi?");
  assert.equal(status,200);
  assert.equal(body.answerKind,"verified");
  assert.deepEqual(body.actions,[{label:"Open Conditions",href:"/conditions"}]);
  assert.match(body.answer,/driver-door/i);
  assert.deepEqual(body.sources.map((source:{pageNumber:number})=>source.pageNumber),[323]);
});

test("road-trip guidance offers the existing trip planner",async()=>{
  const {status,body}=await ask("What should I check before a road trip?");
  assert.equal(status,200);
  assert.equal(body.answerKind,"verified");
  assert.deepEqual(body.actions,[{label:"Open trip planner",href:"/owner-tools?tool=trip"}]);
  assert.match(body.answer,/complete round-trip distance/i);
  assert.ok(body.evidenceLevels.includes("Kitty's records"));
});

test("brake-pad guidance answers with a condition-based interval and valid evidence",async()=>{
  const {status,body}=await ask("How often should I change my brake pads?");
  assert.equal(status,200);
  assert.equal(body.answerKind,"verified");
  assert.deepEqual(body.actions,[{label:"Review maintenance",href:"/maintenance"}]);
  assert.match(body.answer,/do not have one fixed replacement interval/i);
  assert.ok(body.sources.every((source:{pageNumber:number})=>[140,390].includes(source.pageNumber)));
});

test("moving clanking question reuses the symptom navigator guidance",async()=>{
  const {status,body}=await ask("My car has a weird clanking sound when its moving, what should I do?");
  assert.equal(status,200);
  assert.equal(body.answerKind,"verified");
  assert.deepEqual(body.actions,[{label:"Open Symptom Navigator",href:"/owner-tools?tool=symptoms"}]);
  assert.match(body.answer,/cannot diagnose/i);
  assert.match(body.answer,/braking|steering|vibration/i);
  assert.match(body.answer,/turning|bumps|accelerating/i);
  assert.deepEqual(body.evidenceLevels,["General explanation"]);
});

test("jump-start question reuses Quick Help before asking Ollama",async()=>{
  const {status,body}=await ask("how do I jump start my car?");
  assert.equal(status,200);
  assert.equal(body.answerKind,"verified");
  assert.deepEqual(body.actions,[{label:"Open jump-start guide",href:"/dashboard?help=jump"}]);
  assert.match(body.answer,/12-volt/i);
  assert.match(body.answer,/orange high-voltage/i);
  assert.match(body.answer,/READY/i);
  assert.ok(body.evidenceLevels.includes("General explanation"));
});
