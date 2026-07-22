const baseUrl=process.env.OLLAMA_BASE_URL??"http://127.0.0.1:11434";
export const ollamaModel=process.env.OLLAMA_MODEL??"qwen3:4b";

export async function askOllama<T>(messages:Array<{role:"system"|"user";content:string}>,format:Record<string,unknown>){
  const response=await fetch(`${baseUrl}/api/chat`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({model:ollamaModel,messages,format,stream:false,think:false,keep_alive:0,options:{temperature:.1,num_ctx:4096}}),signal:AbortSignal.timeout(120000)});
  if(!response.ok)throw new Error(`Ollama returned ${response.status}.`);
  const result=await response.json();
  if(!result.message?.content)throw new Error("Ollama returned an empty response.");
  return JSON.parse(result.message.content) as T;
}

export async function chatWithOllama(messages:Array<{role:"system"|"user"|"assistant";content:string}>){
  let lastUserIndex=-1;for(let index=messages.length-1;index>=0;index--){if(messages[index].role==="user"){lastUserIndex=index;break}}const directMessages=messages.map((message,index)=>index===lastUserIndex?{...message,content:`${message.content}\n/no_think`}:message);
  const levels=["Kitty's records","Toyota manual","General explanation"] as const;
  const format={type:"object",properties:{answer:{type:"string"},evidenceLevels:{type:"array",items:{type:"string",enum:levels},minItems:1,uniqueItems:true}},required:["answer","evidenceLevels"],additionalProperties:false};
  const response=await fetch(`${baseUrl}/api/chat`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({model:ollamaModel,messages:directMessages,format,stream:false,think:false,keep_alive:0,options:{temperature:.1,num_ctx:4096,num_predict:600}}),signal:AbortSignal.timeout(120000)});
  if(!response.ok)throw new Error(`Ollama returned ${response.status}.`);
  const result=await response.json();
  if(!result.message?.content)throw new Error("Ollama returned an empty response.");
  const parsed=JSON.parse(result.message.content);if(typeof parsed.answer!=="string"||!parsed.answer.trim()||!Array.isArray(parsed.evidenceLevels))throw new Error("Ollama returned an invalid answer.");const evidenceLevels=parsed.evidenceLevels.filter((level:unknown):level is typeof levels[number]=>typeof level==="string"&&levels.includes(level as typeof levels[number]));if(!evidenceLevels.length)throw new Error("Ollama did not identify its evidence level.");return {answer:parsed.answer.trim(),evidenceLevels};
}

export async function ollamaStatus(){
  const response=await fetch(`${baseUrl}/api/tags`,{cache:"no-store",signal:AbortSignal.timeout(2500)});
  if(!response.ok)throw new Error("Ollama is unavailable.");
  const data=await response.json();const models:Array<{name?:string}>=data.models??[];
  return {available:true,model:ollamaModel,installed:models.some(item=>item.name===ollamaModel||item.name?.startsWith(`${ollamaModel}:`))};
}
