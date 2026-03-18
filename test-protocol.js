import { generateProtocol } from './src/data/protocolEngine.js';
import fs from 'fs';

const mockAiData = {
  visualAge: 35,
  hydration: 40,
  elasticity: 50,
  spots: 20,
  wrinkles: 30,
  zones: {
    "Testa": 70,
    "Olhos": 40,
    "Sulco Nasogeniano": 80,
    "Mandíbula": 30,
    "Pescoço": 20
  },
  mainIssue: "Rugas profundas na testa e bigode chinês",
  summary: "Diagnóstico premium."
};

try {
  const protocol = generateProtocol(mockAiData);
  console.log("Protocol Generated Successfully!");
  console.log("Exercises Count:", protocol.exercises.length);
  console.log("Recipes Count:", protocol.recipes.length);
  console.log("Exercises IDs:", protocol.exercises.map(e => e.id));
  console.log("Recipes Names:", protocol.recipes.map(r => r.name));
  
  if (protocol.exercises.length >= 4 && protocol.recipes.length >= 1) {
    console.log("SUCCESS: Protocol meets requirements.");
  } else {
    console.log("FAILURE: Protocol is too short.");
  }
} catch (error) {
  console.error("CRITICAL ERROR during protocol generation:", error);
}
