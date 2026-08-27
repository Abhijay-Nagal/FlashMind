import type { Flashcard } from '../types/flashcard';

export const flashcards: Flashcard[] = [
  {
    id: 'phys-0',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Newton's First Law",
    content: "An object remains at rest or in uniform motion unless acted upon by a net external force.",
    relatedCardId: 'phys-1',
    question: "What happens to a moving object in space if no forces act on it?",
    options: [
      { id: 'a', text: "It gradually slows down" },
      { id: 'b', text: "It stops immediately" },
      { id: 'c', text: "It continues moving at a constant velocity" },
      { id: 'd', text: "It speeds up" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'phys-1',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Newton's Second Law",
    content: "The acceleration of an object depends on the net force and its mass (F = ma).",
    relatedCardId: 'phys-2',
    question: "If you double the net force on an object, what happens to its acceleration?",
    options: [
      { id: 'a', text: "It halves" },
      { id: 'b', text: "It stays the same" },
      { id: 'c', text: "It doubles" },
      { id: 'd', text: "It quadruples" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'phys-2',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Newton's Third Law",
    content: "For every action, there is an equal and opposite reaction.",
    relatedCardId: 'phys-3',
    question: "When you push against a wall, the wall pushes back on you with a force that is:",
    options: [
      { id: 'a', text: "Less than your push" },
      { id: 'b', text: "Greater than your push" },
      { id: 'c', text: "Equal to your push" },
      { id: 'd', text: "Zero" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'phys-3',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Momentum",
    content: "The product of an object's mass and its velocity.",
    relatedCardId: 'phys-4',
    question: "Which has more momentum: a heavy truck at rest or a moving skateboard?",
    options: [
      { id: 'a', text: "The heavy truck" },
      { id: 'b', text: "The moving skateboard" },
      { id: 'c', text: "They have the same" },
      { id: 'd', text: "Depends on the truck's color" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'phys-4',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Impulse",
    content: "The change in momentum caused by a force acting over time.",
    relatedCardId: 'phys-5',
    question: "Why do airbags reduce injury in a crash?",
    options: [
      { id: 'a', text: "They decrease the momentum" },
      { id: 'b', text: "They increase the time of impact, reducing force" },
      { id: 'c', text: "They increase the force of impact" },
      { id: 'd', text: "They stop the car instantly" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'phys-5',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Conservation of Momentum",
    content: "In a closed system, the total momentum remains constant.",
    relatedCardId: 'phys-6',
    question: "When two ice skaters push off each other, their total momentum:",
    options: [
      { id: 'a', text: "Increases" },
      { id: 'b', text: "Decreases" },
      { id: 'c', text: "Remains zero" },
      { id: 'd', text: "Depends on their weight" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'phys-6',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Kinetic Energy",
    content: "The energy an object possesses due to its motion (1/2 mv^2).",
    relatedCardId: 'phys-7',
    question: "If you double an object's speed, its kinetic energy:",
    options: [
      { id: 'a', text: "Doubles" },
      { id: 'b', text: "Halves" },
      { id: 'c', text: "Quadruples" },
      { id: 'd', text: "Remains the same" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'phys-7',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Potential Energy",
    content: "Energy stored in an object due to its position or state.",
    relatedCardId: 'phys-8',
    question: "Where does a roller coaster have the most potential energy?",
    options: [
      { id: 'a', text: "At the bottom of a hill" },
      { id: 'b', text: "At the very top of the highest hill" },
      { id: 'c', text: "In the middle of a loop" },
      { id: 'd', text: "At the end of the ride" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'phys-8',
    topic: "Newton's Laws & Mechanics",
    category: "Physics",
    title: "Work-Energy Theorem",
    content: "The net work done on an object equals its change in kinetic energy.",
    relatedCardId: 'phys-9',
    question: "If net positive work is done on an object, its kinetic energy:",
    options: [
      { id: 'a', text: "Increases" },
      { id: 'b', text: "Decreases" },
      { id: 'c', text: "Remains zero" },
      { id: 'd', text: "Is conserved" }
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
    question: "If you lift a box in 5 seconds instead of 10 seconds, you exert:",
    options: [
      { id: 'a', text: "More work" },
      { id: 'b', text: "Less work" },
      { id: 'c', text: "More power" },
      { id: 'd', text: "Less power" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'bio-0',
    topic: "Plant Biology",
    category: "Biology",
    title: "Photosynthesis",
    content: "Process by which plants use sunlight to synthesize foods from CO2 and water.",
    relatedCardId: 'bio-1',
    question: "What is the primary byproduct of photosynthesis?",
    options: [
      { id: 'a', text: "Carbon dioxide" },
      { id: 'b', text: "Oxygen" },
      { id: 'c', text: "Nitrogen" },
      { id: 'd', text: "Water" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'bio-1',
    topic: "Plant Biology",
    category: "Biology",
    title: "Cellular Respiration",
    content: "Process of oxidizing biological fuels to produce large amounts of energy.",
    relatedCardId: 'bio-2',
    question: "Where does the majority of cellular respiration occur?",
    options: [
      { id: 'a', text: "Nucleus" },
      { id: 'b', text: "Ribosome" },
      { id: 'c', text: "Mitochondria" },
      { id: 'd', text: "Chloroplast" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'bio-2',
    topic: "Plant Biology",
    category: "Biology",
    title: "ATP",
    content: "Adenosine Triphosphate, the principal energy-carrying molecule in cells.",
    relatedCardId: 'bio-3',
    question: "How does ATP release energy?",
    options: [
      { id: 'a', text: "By breaking a phosphate bond to become ADP" },
      { id: 'b', text: "By combining with oxygen" },
      { id: 'c', text: "By absorbing light" },
      { id: 'd', text: "By forming glucose" }
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
    question: "Which pigment inside chloroplasts captures light energy?",
    options: [
      { id: 'a', text: "Melanin" },
      { id: 'b', text: "Hemoglobin" },
      { id: 'c', text: "Chlorophyll" },
      { id: 'd', text: "Carotene" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'bio-4',
    topic: "Plant Biology",
    category: "Biology",
    title: "Mitochondria",
    content: "Organelles where cellular respiration and energy production occur.",
    relatedCardId: 'bio-5',
    question: "Mitochondria are often referred to as the:",
    options: [
      { id: 'a', text: "Brain of the cell" },
      { id: 'b', text: "Powerhouse of the cell" },
      { id: 'c', text: "Recycling center" },
      { id: 'd', text: "Storage unit" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'bio-5',
    topic: "Plant Biology",
    category: "Biology",
    title: "Glycolysis",
    content: "The breakdown of glucose by enzymes, releasing energy and pyruvic acid.",
    relatedCardId: 'bio-6',
    question: "Does glycolysis require oxygen?",
    options: [
      { id: 'a', text: "Yes, always" },
      { id: 'b', text: "No, it is an anaerobic process" },
      { id: 'c', text: "Only in plants" },
      { id: 'd', text: "Only in animals" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'bio-6',
    topic: "Plant Biology",
    category: "Biology",
    title: "Krebs Cycle",
    content: "Series of chemical reactions used by aerobic organisms to release stored energy.",
    relatedCardId: 'bio-7',
    question: "What is another name for the Krebs Cycle?",
    options: [
      { id: 'a', text: "Calvin Cycle" },
      { id: 'b', text: "Citric Acid Cycle" },
      { id: 'c', text: "Lactic Acid Cycle" },
      { id: 'd', text: "Water Cycle" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'bio-7',
    topic: "Plant Biology",
    category: "Biology",
    title: "Electron Transport Chain",
    content: "A series of complexes that transfer electrons to generate ATP.",
    relatedCardId: 'bio-8',
    question: "What is the final electron acceptor in the electron transport chain?",
    options: [
      { id: 'a', text: "Carbon" },
      { id: 'b', text: "Hydrogen" },
      { id: 'c', text: "Oxygen" },
      { id: 'd', text: "Nitrogen" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'bio-8',
    topic: "Plant Biology",
    category: "Biology",
    title: "Fermentation",
    content: "Anaerobic process that allows glycolysis to continue producing ATP.",
    relatedCardId: 'bio-9',
    question: "What builds up in human muscles during strenuous exercise due to fermentation?",
    options: [
      { id: 'a', text: "Ethanol" },
      { id: 'b', text: "Lactic Acid" },
      { id: 'c', text: "Carbon Dioxide" },
      { id: 'd', text: "Glucose" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'bio-9',
    topic: "Plant Biology",
    category: "Biology",
    title: "Stomata",
    content: "Pores on the leaf surface that regulate gas exchange and water loss.",
    relatedCardId: null,
    question: "What gas enters the plant through the stomata for photosynthesis?",
    options: [
      { id: 'a', text: "Oxygen" },
      { id: 'b', text: "Carbon Dioxide" },
      { id: 'c', text: "Nitrogen" },
      { id: 'd', text: "Methane" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'algo-0',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Binary Search",
    content: "Search algorithm that finds a target in a sorted array by halving intervals.",
    relatedCardId: 'algo-1',
    question: "What is a strict prerequisite for Binary Search?",
    options: [
      { id: 'a', text: "Array must be empty" },
      { id: 'b', text: "Array must be sorted" },
      { id: 'c', text: "Array must have even length" },
      { id: 'd', text: "Array must contain only integers" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'algo-1',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Linear Search",
    content: "Simple algorithm that checks every element sequentially until found.",
    relatedCardId: 'algo-2',
    question: "In the worst case, how many elements does linear search check?",
    options: [
      { id: 'a', text: "1" },
      { id: 'b', text: "log(n)" },
      { id: 'c', text: "n/2" },
      { id: 'd', text: "n (all elements)" }
    ],
    correctAnswerId: 'd'
  },
  {
    id: 'algo-2',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Big O Notation",
    content: "Mathematical notation classifying algorithms by run time or space growth.",
    relatedCardId: 'algo-3',
    question: "Which Big O notation represents the fastest execution time?",
    options: [
      { id: 'a', text: "O(1)" },
      { id: 'b', text: "O(n)" },
      { id: 'c', text: "O(n^2)" },
      { id: 'd', text: "O(log n)" }
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
    question: "Why is Bubble Sort rarely used in production code?",
    options: [
      { id: 'a', text: "It's too complex to write" },
      { id: 'b', text: "It has a terrible O(n^2) average time complexity" },
      { id: 'c', text: "It requires too much extra memory" },
      { id: 'd', text: "It only works on small numbers" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'algo-4',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Merge Sort",
    content: "Divide and conquer algorithm that divides an array into halves, sorts, and merges.",
    relatedCardId: 'algo-5',
    question: "What is the time complexity of Merge Sort?",
    options: [
      { id: 'a', text: "O(n)" },
      { id: 'b', text: "O(n log n)" },
      { id: 'c', text: "O(n^2)" },
      { id: 'd', text: "O(1)" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'algo-5',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Quick Sort",
    content: "Divide and conquer algorithm using a pivot to partition arrays.",
    relatedCardId: 'algo-6',
    question: "What is the worst-case time complexity of Quick Sort?",
    options: [
      { id: 'a', text: "O(n log n)" },
      { id: 'b', text: "O(n)" },
      { id: 'c', text: "O(n^2)" },
      { id: 'd', text: "O(1)" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'algo-6',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Hash Tables",
    content: "Data structure that implements an associative array for fast data retrieval.",
    relatedCardId: 'algo-7',
    question: "What is the primary advantage of a Hash Table?",
    options: [
      { id: 'a', text: "Elements remain perfectly sorted" },
      { id: 'b', text: "O(1) average time for lookups" },
      { id: 'c', text: "It takes zero memory" },
      { id: 'd', text: "It has no collisions" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'algo-7',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Time Complexity",
    content: "The computational complexity that describes the amount of computer time it takes.",
    relatedCardId: 'algo-8',
    question: "Which complexity indicates execution time doubles with each added element?",
    options: [
      { id: 'a', text: "O(n)" },
      { id: 'b', text: "O(log n)" },
      { id: 'c', text: "O(2^n)" },
      { id: 'd', text: "O(n!)" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'algo-8',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Space Complexity",
    content: "The amount of memory an algorithm needs to run to completion.",
    relatedCardId: 'algo-9',
    question: "An algorithm that modifies an array in-place without extra arrays has a space complexity of:",
    options: [
      { id: 'a', text: "O(n)" },
      { id: 'b', text: "O(1)" },
      { id: 'c', text: "O(n^2)" },
      { id: 'd', text: "O(log n)" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'algo-9',
    topic: "Algorithms",
    category: "Computer Science",
    title: "Recursion",
    content: "A method of solving a problem where the solution depends on solutions to smaller instances.",
    relatedCardId: null,
    question: "What critical component must every recursive function have?",
    options: [
      { id: 'a', text: "A loop" },
      { id: 'b', text: "A base case to stop calling itself" },
      { id: 'c', text: "A global variable" },
      { id: 'd', text: "A hash table" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'geo-0',
    topic: "Earth Science",
    category: "Geology",
    title: "The Water Cycle",
    content: "Continuous movement of water within the Earth and atmosphere.",
    relatedCardId: 'geo-1',
    question: "What is the primary energy source that drives the water cycle?",
    options: [
      { id: 'a', text: "Earth's core" },
      { id: 'b', text: "The Moon" },
      { id: 'c', text: "The Sun" },
      { id: 'd', text: "Wind" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'geo-1',
    topic: "Earth Science",
    category: "Geology",
    title: "Evaporation",
    content: "Process of turning from liquid into vapor, driven by thermal energy.",
    relatedCardId: 'geo-2',
    question: "Evaporation mostly occurs from which of the following?",
    options: [
      { id: 'a', text: "Glaciers" },
      { id: 'b', text: "Oceans" },
      { id: 'c', text: "Underground caves" },
      { id: 'd', text: "Mountains" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'geo-2',
    topic: "Earth Science",
    category: "Geology",
    title: "Condensation",
    content: "Conversion of vapor to a liquid, responsible for cloud formation.",
    relatedCardId: 'geo-3',
    question: "What must happen to air for condensation to occur?",
    options: [
      { id: 'a', text: "It must heat up" },
      { id: 'b', text: "It must cool down" },
      { id: 'c', text: "It must speed up" },
      { id: 'd', text: "It must lose oxygen" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'geo-3',
    topic: "Earth Science",
    category: "Geology",
    title: "Precipitation",
    content: "Any product of the condensation of atmospheric water vapor that falls.",
    relatedCardId: 'geo-4',
    question: "Which of the following is NOT a form of precipitation?",
    options: [
      { id: 'a', text: "Rain" },
      { id: 'b', text: "Snow" },
      { id: 'c', text: "Fog" },
      { id: 'd', text: "Hail" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'geo-4',
    topic: "Earth Science",
    category: "Geology",
    title: "Groundwater",
    content: "Water held underground in the soil or in pores and crevices in rock.",
    relatedCardId: 'geo-5',
    question: "What is the upper surface of the zone of saturation called?",
    options: [
      { id: 'a', text: "Aquifer" },
      { id: 'b', text: "Water table" },
      { id: 'c', text: "Bedrock" },
      { id: 'd', text: "Mantle" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'geo-5',
    topic: "Earth Science",
    category: "Geology",
    title: "Transpiration",
    content: "Process where plants absorb water through roots and give off vapor through leaves.",
    relatedCardId: 'geo-6',
    question: "Transpiration is essentially evaporation from what?",
    options: [
      { id: 'a', text: "Oceans" },
      { id: 'b', text: "Soil" },
      { id: 'c', text: "Plants" },
      { id: 'd', text: "Animals" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'geo-6',
    topic: "Earth Science",
    category: "Geology",
    title: "Runoff",
    content: "The flow of water occurring on the ground surface when excess water cannot infiltrate.",
    relatedCardId: 'geo-7',
    question: "Runoff typically leads directly to:",
    options: [
      { id: 'a', text: "More rain" },
      { id: 'b', text: "Rivers and streams" },
      { id: 'c', text: "Earthquakes" },
      { id: 'd', text: "Tornadoes" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'geo-7',
    topic: "Earth Science",
    category: "Geology",
    title: "Infiltration",
    content: "Process by which water on the ground surface enters the soil.",
    relatedCardId: 'geo-8',
    question: "Which surface allows for the most infiltration?",
    options: [
      { id: 'a', text: "Concrete pavement" },
      { id: 'b', text: "Dense clay" },
      { id: 'c', text: "Loose sandy soil" },
      { id: 'd', text: "Solid bedrock" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'geo-8',
    topic: "Earth Science",
    category: "Geology",
    title: "Aquifers",
    content: "Underground layer of water-bearing permeable rock, rock fractures, or unconsolidated materials.",
    relatedCardId: 'geo-9',
    question: "Why are aquifers important to humans?",
    options: [
      { id: 'a', text: "They cause earthquakes" },
      { id: 'b', text: "They store oil" },
      { id: 'c', text: "They are a massive source of fresh drinking water" },
      { id: 'd', text: "They create volcanoes" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'geo-9',
    topic: "Earth Science",
    category: "Geology",
    title: "Sublimation",
    content: "Transition of a substance directly from solid to gas state.",
    relatedCardId: null,
    question: "Which of the following is an example of sublimation in nature?",
    options: [
      { id: 'a', text: "Snow melting into water" },
      { id: 'b', text: "Water boiling into steam" },
      { id: 'c', text: "Dry ice turning into carbon dioxide gas" },
      { id: 'd', text: "Dew forming on grass" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'em-0',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Electromagnetic Induction",
    content: "Production of an EMF across a conductor in a changing magnetic field.",
    relatedCardId: 'em-1',
    question: "Who discovered electromagnetic induction?",
    options: [
      { id: 'a', text: "Albert Einstein" },
      { id: 'b', text: "Michael Faraday" },
      { id: 'c', text: "Isaac Newton" },
      { id: 'd', text: "Thomas Edison" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'em-1',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Faraday's Law",
    content: "States that a changing magnetic environment induces an EMF in a loop of wire.",
    relatedCardId: 'em-2',
    question: "How can you increase the induced EMF in a coil?",
    options: [
      { id: 'a', text: "Move the magnet slower" },
      { id: 'b', text: "Use fewer coils of wire" },
      { id: 'c', text: "Move the magnet faster through the coil" },
      { id: 'd', text: "Use a weaker magnet" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'em-2',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Transformers",
    content: "Passive device that transfers electrical energy from one circuit to another.",
    relatedCardId: 'em-3',
    question: "What do step-up transformers increase?",
    options: [
      { id: 'a', text: "Voltage" },
      { id: 'b', text: "Current" },
      { id: 'c', text: "Resistance" },
      { id: 'd', text: "Power" }
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
    question: "Lenz's law is a consequence of the conservation of what?",
    options: [
      { id: 'a', text: "Mass" },
      { id: 'b', text: "Charge" },
      { id: 'c', text: "Energy" },
      { id: 'd', text: "Momentum" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'em-4',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Magnetic Flux",
    content: "Measurement of the total magnetic field which passes through a given area.",
    relatedCardId: 'em-5',
    question: "If a loop of wire is parallel to the magnetic field, what is the magnetic flux through it?",
    options: [
      { id: 'a', text: "Maximum" },
      { id: 'b', text: "Minimum" },
      { id: 'c', text: "Zero" },
      { id: 'd', text: "Infinite" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'em-5',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Generators",
    content: "Machines that convert mechanical energy into electrical energy.",
    relatedCardId: 'em-6',
    question: "Generators operate based on what principle?",
    options: [
      { id: 'a', text: "Ohm's Law" },
      { id: 'b', text: "Electromagnetic Induction" },
      { id: 'c', text: "Thermodynamics" },
      { id: 'd', text: "Gravity" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'em-6',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Alternating Current",
    content: "Electric current which periodically reverses direction.",
    relatedCardId: 'em-7',
    question: "What is the standard frequency of AC power in the United States?",
    options: [
      { id: 'a', text: "50 Hz" },
      { id: 'b', text: "60 Hz" },
      { id: 'c', text: "100 Hz" },
      { id: 'd', text: "120 Hz" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'em-7',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Direct Current",
    content: "Electric current that flows consistently in one direction.",
    relatedCardId: 'em-8',
    question: "Which of the following primarily produces Direct Current (DC)?",
    options: [
      { id: 'a', text: "Wall outlets" },
      { id: 'b', text: "Wind turbines" },
      { id: 'c', text: "Batteries" },
      { id: 'd', text: "Nuclear power plants" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'em-8',
    topic: "Electromagnetism",
    category: "Physics",
    title: "Eddy Currents",
    content: "Loops of electrical current induced within conductors by a changing magnetic field.",
    relatedCardId: 'em-9',
    question: "What is a common application that intentionally uses eddy currents?",
    options: [
      { id: 'a', text: "Induction cooktops" },
      { id: 'b', text: "Lightbulbs" },
      { id: 'c', text: "Batteries" },
      { id: 'd', text: "Solar panels" }
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
    question: "What is the standard unit of inductance?",
    options: [
      { id: 'a', text: "Ohm" },
      { id: 'b', text: "Farad" },
      { id: 'c', text: "Henry" },
      { id: 'd', text: "Tesla" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'hist-0',
    topic: "Modern History",
    category: "History",
    title: "World War II",
    content: "A global conflict that lasted from 1939 to 1945.",
    relatedCardId: 'hist-1',
    question: "Which event triggered the start of WWII in Europe?",
    options: [
      { id: 'a', text: "The bombing of Pearl Harbor" },
      { id: 'b', text: "The assassination of Archduke Ferdinand" },
      { id: 'c', text: "The invasion of Poland by Germany" },
      { id: 'd', text: "The signing of the Treaty of Versailles" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'hist-1',
    topic: "Modern History",
    category: "History",
    title: "Attack on Pearl Harbor",
    content: "Surprise military strike by the Japanese Navy upon the US on Dec 7, 1941.",
    relatedCardId: 'hist-2',
    question: "What was the immediate consequence of this attack?",
    options: [
      { id: 'a', text: "Germany surrendered" },
      { id: 'b', text: "The US officially entered WWII" },
      { id: 'c', text: "The UN was formed" },
      { id: 'd', text: "Japan surrendered" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'hist-2',
    topic: "Modern History",
    category: "History",
    title: "D-Day (Operation Overlord)",
    content: "The Allied invasion of Normandy on June 6, 1944.",
    relatedCardId: 'hist-3',
    question: "Which beaches were targeted during the Normandy landings?",
    options: [
      { id: 'a', text: "Miami and Daytona" },
      { id: 'b', text: "Iwo Jima and Okinawa" },
      { id: 'c', text: "Omaha, Utah, Gold, Juno, Sword" },
      { id: 'd', text: "Dunkirk and Calais" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'hist-3',
    topic: "Modern History",
    category: "History",
    title: "Battle of Stalingrad",
    content: "Major battle where Nazi Germany fought the Soviet Union for control of Stalingrad.",
    relatedCardId: 'hist-4',
    question: "Why is the Battle of Stalingrad historically significant?",
    options: [
      { id: 'a', text: "It was fought entirely at sea" },
      { id: 'b', text: "It was the first use of nuclear weapons" },
      { id: 'c', text: "It marked the turning point of the war on the Eastern Front" },
      { id: 'd', text: "It led to the immediate surrender of Germany" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'hist-4',
    topic: "Modern History",
    category: "History",
    title: "Battle of Midway",
    content: "Decisive naval battle in the Pacific Theater, defeating the attacking Japanese fleet.",
    relatedCardId: 'hist-5',
    question: "What key advantage did the US have at the Battle of Midway?",
    options: [
      { id: 'a', text: "More ships" },
      { id: 'b', text: "Better airplanes" },
      { id: 'c', text: "Codebreakers had deciphered Japanese plans" },
      { id: 'd', text: "A surprise storm" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'hist-5',
    topic: "Modern History",
    category: "History",
    title: "The Holocaust",
    content: "The systematic, state-sponsored genocide of six million European Jews.",
    relatedCardId: 'hist-6',
    question: "Which regime was responsible for the Holocaust?",
    options: [
      { id: 'a', text: "Fascist Italy" },
      { id: 'b', text: "Nazi Germany" },
      { id: 'c', text: "Imperial Japan" },
      { id: 'd', text: "Soviet Union" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'hist-6',
    topic: "Modern History",
    category: "History",
    title: "Manhattan Project",
    content: "Research and development undertaking that produced the first nuclear weapons.",
    relatedCardId: 'hist-7',
    question: "Who was the lead theoretical physicist of the Manhattan Project?",
    options: [
      { id: 'a', text: "Albert Einstein" },
      { id: 'b', text: "J. Robert Oppenheimer" },
      { id: 'c', text: "Niels Bohr" },
      { id: 'd', text: "Richard Feynman" }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'hist-7',
    topic: "Modern History",
    category: "History",
    title: "Hiroshima and Nagasaki",
    content: "The two Japanese cities where the US dropped atomic bombs in 1945.",
    relatedCardId: 'hist-8',
    question: "What was the result of the atomic bombings?",
    options: [
      { id: 'a', text: "Japan fought harder" },
      { id: 'b', text: "The Soviet Union declared war on the US" },
      { id: 'c', text: "Japan surrendered, ending WWII" },
      { id: 'd', text: "Germany surrendered" }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'hist-8',
    topic: "Modern History",
    category: "History",
    title: "Yalta Conference",
    content: "Meeting of heads of government of the US, UK, and Soviet Union to discuss post-war reorganization.",
    relatedCardId: 'hist-9',
    question: "Who were the 'Big Three' leaders present at Yalta?",
    options: [
      { id: 'a', text: "Roosevelt, Churchill, Stalin" },
      { id: 'b', text: "Truman, Churchill, Hitler" },
      { id: 'c', text: "Roosevelt, Mussolini, Stalin" },
      { id: 'd', text: "Truman, Atlee, Stalin" }
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
    question: "What organization did the United Nations replace?",
    options: [
      { id: 'a', text: "NATO" },
      { id: 'b', text: "The League of Nations" },
      { id: 'c', text: "The European Union" },
      { id: 'd', text: "The Warsaw Pact" }
    ],
    correctAnswerId: 'b'
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
