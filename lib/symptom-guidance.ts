export type SymptomChoice={id:string;label:string;severity:"Low"|"Medium"|"High"|"Urgent";urgency:string;copy:string;capture:string};

export const soundSymptomGuidance:{label:string;choices:SymptomChoice[]}={label:"I hear something",choices:[
  {id:"grinding",label:"Grinding or scraping",severity:"High",urgency:"Inspect promptly",copy:"Avoid unnecessary driving, especially if it changes with braking or wheel speed.",capture:"Record which side, vehicle speed, and whether braking changes it."},
  {id:"squeal",label:"Squeal or chirp",severity:"Medium",urgency:"Schedule an inspection",copy:"A repeating or braking-related squeal deserves inspection even if the car still feels normal.",capture:"Record cold versus warm, braking input, and whether it repeats with speed."},
  {id:"clicking",label:"Clicking, clanking, or clunking",severity:"Medium",urgency:"Inspect soon",copy:"Avoid hard acceleration or rough roads until the source is checked if the sound is worsening.",capture:"Record turning direction, bumps, acceleration, and where it seems to come from."},
  {id:"knocking",label:"Knock or heavy bang",severity:"High",urgency:"Stop if severe or repeating",copy:"A loud repeating knock, loss of power, or warning light is not something to drive through.",capture:"Note engine speed, road speed, warning lights, and whether power changed."},
]};

export function matchSoundSymptom(question:string){const text=question.toLowerCase().replace(/[^a-z0-9]+/g," ");if(!/(sound|noise|hear|clank|clunk|click|grind|scrap|squeal|chirp|knock|bang)/.test(text))return null;if(/clank|clunk|click/.test(text))return soundSymptomGuidance.choices.find(choice=>choice.id==="clicking")!;if(/grind|scrap/.test(text))return soundSymptomGuidance.choices.find(choice=>choice.id==="grinding")!;if(/squeal|chirp/.test(text))return soundSymptomGuidance.choices.find(choice=>choice.id==="squeal")!;if(/knock|bang/.test(text))return soundSymptomGuidance.choices.find(choice=>choice.id==="knocking")!;return null}
