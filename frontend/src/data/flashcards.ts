import type { Flashcard } from '../types/flashcard';

export const flashcards: Flashcard[] = [
  {
    id: 'phys-0',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Newton's First Law",
    content: "An object remains at rest or in uniform motion unless acted upon by a net external force.",
    relatedCardId: 'phys-1',
    question: "Test your knowledge on Newton's First Law: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'phys-1',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Newton's Second Law",
    content: "The acceleration of an object depends on the net force and its mass (F = ma).",
    relatedCardId: 'phys-2',
    question: "Test your knowledge on Newton's Second Law: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'phys-2',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Newton's Third Law",
    content: "For every action, there is an equal and opposite reaction.",
    relatedCardId: 'phys-3',
    question: "Test your knowledge on Newton's Third Law: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'phys-3',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Momentum",
    content: "The product of an object's mass and its velocity. Represents quantity of motion.",
    relatedCardId: 'phys-4',
    question: "Test your knowledge on Momentum: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'phys-4',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Impulse",
    content: "The change in momentum caused by a force acting over time.",
    relatedCardId: 'phys-5',
    question: "Test your knowledge on Impulse: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'phys-5',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Conservation of Momentum",
    content: "In a closed system, the total momentum remains constant.",
    relatedCardId: 'phys-6',
    question: "Test your knowledge on Conservation of Momentum: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'phys-6',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Kinetic Energy",
    content: "The energy an object possesses due to its motion (1/2 mv^2).",
    relatedCardId: 'phys-7',
    question: "Test your knowledge on Kinetic Energy: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'phys-7',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Potential Energy",
    content: "Energy stored in an object due to its position or state.",
    relatedCardId: 'phys-8',
    question: "Test your knowledge on Potential Energy: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'phys-8',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Work-Energy Theorem",
    content: "The net work done on an object equals its change in kinetic energy.",
    relatedCardId: 'phys-9',
    question: "Test your knowledge on Work-Energy Theorem: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'phys-9',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Power",
    content: "The rate at which work is done or energy is transferred.",
    relatedCardId: null,
    question: "Test your knowledge on Power: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'bio-0',
    topic: "Plant Biology",
    category: "Biology",
    title: "Photosynthesis",
    content: "Process by which plants use sunlight to synthesize foods from CO2 and water.",
    relatedCardId: 'bio-1',
    question: "Test your knowledge on Photosynthesis: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'bio-1',
    topic: "Plant Biology",
    category: "Biology",
    title: "Cellular Respiration",
    content: "Process of oxidizing biological fuels to produce large amounts of energy.",
    relatedCardId: 'bio-2',
    question: "Test your knowledge on Cellular Respiration: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'bio-2',
    topic: "Plant Biology",
    category: "Biology",
    title: "ATP",
    content: "Adenosine Triphosphate, the principal energy-carrying molecule in cells.",
    relatedCardId: 'bio-3',
    question: "Test your knowledge on ATP: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'bio-3',
    topic: "Plant Biology",
    category: "Biology",
    title: "Chloroplasts",
    content: "Organelles in plant cells where photosynthesis takes place.",
    relatedCardId: 'bio-4',
    question: "Test your knowledge on Chloroplasts: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'bio-4',
    topic: "Plant Biology",
    category: "Biology",
    title: "Mitochondria",
    content: "Organelles where cellular respiration and energy production occur.",
    relatedCardId: 'bio-5',
    question: "Test your knowledge on Mitochondria: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'bio-5',
    topic: "Plant Biology",
    category: "Biology",
    title: "Glycolysis",
    content: "The breakdown of glucose by enzymes, releasing energy and pyruvic acid.",
    relatedCardId: 'bio-6',
    question: "Test your knowledge on Glycolysis: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'bio-6',
    topic: "Plant Biology",
    category: "Biology",
    title: "Krebs Cycle",
    content: "Series of chemical reactions used by aerobic organisms to release stored energy.",
    relatedCardId: 'bio-7',
    question: "Test your knowledge on Krebs Cycle: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'bio-7',
    topic: "Plant Biology",
    category: "Biology",
    title: "Electron Transport Chain",
    content: "A series of complexes that transfer electrons to generate ATP.",
    relatedCardId: 'bio-8',
    question: "Test your knowledge on Electron Transport Chain: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'bio-8',
    topic: "Plant Biology",
    category: "Biology",
    title: "Fermentation",
    content: "Anaerobic process that allows glycolysis to continue producing ATP.",
    relatedCardId: 'bio-9',
    question: "Test your knowledge on Fermentation: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'bio-9',
    topic: "Plant Biology",
    category: "Biology",
    title: "Stomata",
    content: "Pores on the leaf surface that regulate gas exchange and water loss.",
    relatedCardId: null,
    question: "Test your knowledge on Stomata: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'algo-0',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Binary Search",
    content: "Search algorithm that finds a target in a sorted array by halving intervals.",
    relatedCardId: 'algo-1',
    question: "Test your knowledge on Binary Search: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'algo-1',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Linear Search",
    content: "Simple algorithm that checks every element sequentially until found.",
    relatedCardId: 'algo-2',
    question: "Test your knowledge on Linear Search: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'algo-2',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Big O Notation",
    content: "Mathematical notation classifying algorithms by run time or space growth.",
    relatedCardId: 'algo-3',
    question: "Test your knowledge on Big O Notation: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'algo-3',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Bubble Sort",
    content: "Simple sorting algorithm that repeatedly steps through and swaps adjacent elements.",
    relatedCardId: 'algo-4',
    question: "Test your knowledge on Bubble Sort: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'algo-4',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Merge Sort",
    content: "Divide and conquer algorithm that divides an array into halves, sorts, and merges.",
    relatedCardId: 'algo-5',
    question: "Test your knowledge on Merge Sort: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'algo-5',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Quick Sort",
    content: "Divide and conquer algorithm using a pivot to partition arrays.",
    relatedCardId: 'algo-6',
    question: "Test your knowledge on Quick Sort: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'algo-6',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Hash Tables",
    content: "Data structure that implements an associative array for fast data retrieval.",
    relatedCardId: 'algo-7',
    question: "Test your knowledge on Hash Tables: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'algo-7',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Time Complexity",
    content: "The computational complexity that describes the amount of computer time it takes.",
    relatedCardId: 'algo-8',
    question: "Test your knowledge on Time Complexity: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'algo-8',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Space Complexity",
    content: "The amount of memory an algorithm needs to run to completion.",
    relatedCardId: 'algo-9',
    question: "Test your knowledge on Space Complexity: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'algo-9',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Recursion",
    content: "A method of solving a problem where the solution depends on solutions to smaller instances.",
    relatedCardId: null,
    question: "Test your knowledge on Recursion: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'geo-0',
    topic: "Earth Science",
    category: "Geology",
    title: "The Water Cycle",
    content: "Continuous movement of water within the Earth and atmosphere.",
    relatedCardId: 'geo-1',
    question: "Test your knowledge on The Water Cycle: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'geo-1',
    topic: "Earth Science",
    category: "Geology",
    title: "Evaporation",
    content: "Process of turning from liquid into vapor, driven by thermal energy.",
    relatedCardId: 'geo-2',
    question: "Test your knowledge on Evaporation: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'geo-2',
    topic: "Earth Science",
    category: "Geology",
    title: "Condensation",
    content: "Conversion of vapor to a liquid, responsible for cloud formation.",
    relatedCardId: 'geo-3',
    question: "Test your knowledge on Condensation: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'geo-3',
    topic: "Earth Science",
    category: "Geology",
    title: "Precipitation",
    content: "Any product of the condensation of atmospheric water vapor that falls.",
    relatedCardId: 'geo-4',
    question: "Test your knowledge on Precipitation: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'geo-4',
    topic: "Earth Science",
    category: "Geology",
    title: "Groundwater",
    content: "Water held underground in the soil or in pores and crevices in rock.",
    relatedCardId: 'geo-5',
    question: "Test your knowledge on Groundwater: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'geo-5',
    topic: "Earth Science",
    category: "Geology",
    title: "Transpiration",
    content: "Process where plants absorb water through roots and give off vapor through leaves.",
    relatedCardId: 'geo-6',
    question: "Test your knowledge on Transpiration: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'geo-6',
    topic: "Earth Science",
    category: "Geology",
    title: "Runoff",
    content: "The flow of water occurring on the ground surface when excess water cannot infiltrate.",
    relatedCardId: 'geo-7',
    question: "Test your knowledge on Runoff: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'geo-7',
    topic: "Earth Science",
    category: "Geology",
    title: "Infiltration",
    content: "Process by which water on the ground surface enters the soil.",
    relatedCardId: 'geo-8',
    question: "Test your knowledge on Infiltration: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'geo-8',
    topic: "Earth Science",
    category: "Geology",
    title: "Aquifers",
    content: "Underground layer of water-bearing permeable rock, rock fractures, or unconsolidated materials.",
    relatedCardId: 'geo-9',
    question: "Test your knowledge on Aquifers: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'geo-9',
    topic: "Earth Science",
    category: "Geology",
    title: "Sublimation",
    content: "Transition of a substance directly from solid to gas state.",
    relatedCardId: null,
    question: "Test your knowledge on Sublimation: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'em-0',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Electromagnetic Induction",
    content: "Production of an EMF across a conductor in a changing magnetic field.",
    relatedCardId: 'em-1',
    question: "Test your knowledge on Electromagnetic Induction: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'em-1',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Faraday's Law",
    content: "States that a changing magnetic environment induces an EMF in a loop of wire.",
    relatedCardId: 'em-2',
    question: "Test your knowledge on Faraday's Law: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'em-2',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Transformers",
    content: "Passive device that transfers electrical energy from one circuit to another.",
    relatedCardId: 'em-3',
    question: "Test your knowledge on Transformers: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'em-3',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Lenz's Law",
    content: "The direction of an induced current is such that it opposes the change in magnetic flux.",
    relatedCardId: 'em-4',
    question: "Test your knowledge on Lenz's Law: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'em-4',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Magnetic Flux",
    content: "Measurement of the total magnetic field which passes through a given area.",
    relatedCardId: 'em-5',
    question: "Test your knowledge on Magnetic Flux: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'em-5',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Generators",
    content: "Machines that convert mechanical energy into electrical energy.",
    relatedCardId: 'em-6',
    question: "Test your knowledge on Generators: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'em-6',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Alternating Current",
    content: "Electric current which periodically reverses direction.",
    relatedCardId: 'em-7',
    question: "Test your knowledge on Alternating Current: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'em-7',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Direct Current",
    content: "Electric current that flows consistently in one direction.",
    relatedCardId: 'em-8',
    question: "Test your knowledge on Direct Current: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'em-8',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Eddy Currents",
    content: "Loops of electrical current induced within conductors by a changing magnetic field.",
    relatedCardId: 'em-9',
    question: "Test your knowledge on Eddy Currents: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'em-9',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Inductance",
    content: "Property of an electrical conductor by which a change in current induces an EMF.",
    relatedCardId: null,
    question: "Test your knowledge on Inductance: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'hist-0',
    topic: "Modern History",
    category: "History",
    title: "World War II",
    content: "A global conflict that lasted from 1939 to 1945.",
    relatedCardId: 'hist-1',
    question: "Test your knowledge on World War II: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'hist-1',
    topic: "Modern History",
    category: "History",
    title: "Attack on Pearl Harbor",
    content: "Surprise military strike by the Japanese Navy upon the US on Dec 7, 1941.",
    relatedCardId: 'hist-2',
    question: "Test your knowledge on Attack on Pearl Harbor: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'hist-2',
    topic: "Modern History",
    category: "History",
    title: "D-Day (Operation Overlord)",
    content: "The Allied invasion of Normandy on June 6, 1944.",
    relatedCardId: 'hist-3',
    question: "Test your knowledge on D-Day (Operation Overlord): what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'hist-3',
    topic: "Modern History",
    category: "History",
    title: "Battle of Stalingrad",
    content: "Major battle where Nazi Germany fought the Soviet Union for control of Stalingrad.",
    relatedCardId: 'hist-4',
    question: "Test your knowledge on Battle of Stalingrad: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'hist-4',
    topic: "Modern History",
    category: "History",
    title: "Battle of Midway",
    content: "Decisive naval battle in the Pacific Theater, defeating the attacking Japanese fleet.",
    relatedCardId: 'hist-5',
    question: "Test your knowledge on Battle of Midway: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'hist-5',
    topic: "Modern History",
    category: "History",
    title: "The Holocaust",
    content: "The systematic, state-sponsored genocide of six million European Jews.",
    relatedCardId: 'hist-6',
    question: "Test your knowledge on The Holocaust: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'hist-6',
    topic: "Modern History",
    category: "History",
    title: "Manhattan Project",
    content: "Research and development undertaking that produced the first nuclear weapons.",
    relatedCardId: 'hist-7',
    question: "Test your knowledge on Manhattan Project: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'hist-7',
    topic: "Modern History",
    category: "History",
    title: "Hiroshima and Nagasaki",
    content: "The two Japanese cities where the US dropped atomic bombs in 1945.",
    relatedCardId: 'hist-8',
    question: "Test your knowledge on Hiroshima and Nagasaki: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'hist-8',
    topic: "Modern History",
    category: "History",
    title: "Yalta Conference",
    content: "Meeting of heads of government of the US, UK, and Soviet Union to discuss post-war reorganization.",
    relatedCardId: 'hist-9',
    question: "Test your knowledge on Yalta Conference: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: 'hist-9',
    topic: "Modern History",
    category: "History",
    title: "United Nations",
    content: "Intergovernmental organization founded in 1945 to promote international peace.",
    relatedCardId: null,
    question: "Test your knowledge on United Nations: what is the key concept here?",
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctAnswerId: 'a'
  },
];

export const flashcardChains = [
  ['phys-0', 'phys-1', 'phys-2', 'phys-3', 'phys-4', 'phys-5', 'phys-6', 'phys-7', 'phys-8', 'phys-9'],
  ['bio-0', 'bio-1', 'bio-2', 'bio-3', 'bio-4', 'bio-5', 'bio-6', 'bio-7', 'bio-8', 'bio-9'],
  ['algo-0', 'algo-1', 'algo-2', 'algo-3', 'algo-4', 'algo-5', 'algo-6', 'algo-7', 'algo-8', 'algo-9'],
  ['geo-0', 'geo-1', 'geo-2', 'geo-3', 'geo-4', 'geo-5', 'geo-6', 'geo-7', 'geo-8', 'geo-9'],
  ['em-0', 'em-1', 'em-2', 'em-3', 'em-4', 'em-5', 'em-6', 'em-7', 'em-8', 'em-9'],
  ['hist-0', 'hist-1', 'hist-2', 'hist-3', 'hist-4', 'hist-5', 'hist-6', 'hist-7', 'hist-8', 'hist-9'],
];
