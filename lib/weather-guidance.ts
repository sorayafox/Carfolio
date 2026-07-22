export const tirePressureGuidance={
  placard:"Use the cold-pressure value on Kitty’s driver-door placard—not the tire sidewall maximum.",
  cold:"Cold can reduce tire pressure. Check with a gauge when the tires are cold and watch for TPMS alerts.",
  disclaimer:"Weather guidance is contextual, not a vehicle sensor reading. Always confirm actual tire pressure with a gauge and follow the door-jamb placard and owner’s manual."
};

export function estimatedPressureChange(temperatureSwing:number){return Math.round(temperatureSwing/10*10)/10}
