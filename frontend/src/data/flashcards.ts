import type { Flashcard } from '../types/flashcard';

export const flashcards: Flashcard[] = [
  // --- Newton's Laws Chain ---
  {
    id: 'newton-1',
    topic: "Newton's Laws",
    category: 'Physics',
    title: "Newton's First Law",
    content: 'An object remains at rest or continues in uniform straight-line motion unless acted upon by a net external force.',
    relatedCardId: 'newton-2',
    question: 'What happens to an object when the net force acting on it is zero?',
    options: [
      { id: 'a', text: 'It must accelerate.' },
      { id: 'b', text: 'It must stop moving.' },
      { id: 'c', text: 'It remains at rest or moves with constant velocity.' },
      { id: 'd', text: 'Its mass increases.' }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'newton-2',
    topic: "Newton's Laws",
    category: 'Physics',
    title: "Newton's Second Law",
    content: 'The acceleration of an object depends on the net force acting upon the object and the mass of the object (F = ma).',
    relatedCardId: 'newton-3',
    question: 'If you push two objects with the same force, which one will accelerate more?',
    options: [
      { id: 'a', text: 'The one with more mass.' },
      { id: 'b', text: 'The one with less mass.' },
      { id: 'c', text: 'They will accelerate equally.' },
      { id: 'd', text: 'Neither will accelerate.' }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'newton-3',
    topic: "Newton's Laws",
    category: 'Physics',
    title: "Newton's Third Law",
    content: 'For every action, there is an equal and opposite reaction. Forces occur in equal and opposite pairs acting on different objects.',
    relatedCardId: 'momentum',
    question: 'If you push against a wall with 50N of force, how much force does the wall exert on you?',
    options: [
      { id: 'a', text: '0N' },
      { id: 'b', text: '25N' },
      { id: 'c', text: '50N' },
      { id: 'd', text: '100N' }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'momentum',
    topic: "Mechanics",
    category: 'Physics',
    title: "Momentum",
    content: "Momentum is the product of an object's mass and its velocity. It represents the quantity of motion an object has.",
    relatedCardId: 'impulse',
    question: 'A large truck and a small car are moving at the same speed. Which has more momentum?',
    options: [
      { id: 'a', text: 'The small car' },
      { id: 'b', text: 'The large truck' },
      { id: 'c', text: 'They have the same momentum' },
      { id: 'd', text: 'Neither has momentum' }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'impulse',
    topic: "Mechanics",
    category: 'Physics',
    title: "Impulse",
    content: 'Impulse is related to the change in momentum caused by a force acting over a period of time.',
    relatedCardId: null, // End of this specific chain
    question: 'How can you increase the impulse applied to an object?',
    options: [
      { id: 'a', text: 'Apply a smaller force for less time.' },
      { id: 'b', text: 'Decrease the mass of the object.' },
      { id: 'c', text: 'Apply the same force for a longer time.' },
      { id: 'd', text: 'Keep the object stationary.' }
    ],
    correctAnswerId: 'c'
  },

  // --- Plant Biology Chain ---
  {
    id: 'photosynthesis',
    topic: "Plant Biology",
    category: 'Biology',
    title: "Photosynthesis",
    content: 'The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.',
    relatedCardId: 'cellular-respiration',
    question: 'What is the primary byproduct of photosynthesis released into the atmosphere?',
    options: [
      { id: 'a', text: 'Carbon Dioxide' },
      { id: 'b', text: 'Oxygen' },
      { id: 'c', text: 'Nitrogen' },
      { id: 'd', text: 'Hydrogen' }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'cellular-respiration',
    topic: "Plant Biology",
    category: 'Biology',
    title: "Cellular Respiration",
    content: "The process by which biological fuels are oxidized in the presence of an inorganic electron acceptor to produce large amounts of energy.",
    relatedCardId: 'atp',
    question: "Where does cellular respiration primarily occur in eukaryotic cells?",
    options: [
      { id: 'a', text: 'Nucleus' },
      { id: 'b', text: 'Chloroplast' },
      { id: 'c', text: 'Mitochondria' },
      { id: 'd', text: 'Ribosome' }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'atp',
    topic: "Plant Biology",
    category: 'Biology',
    title: "ATP (Adenosine Triphosphate)",
    content: "The principal molecule for storing and transferring energy in cells. It is often referred to as the energy currency of the cell.",
    relatedCardId: null,
    question: "What happens when ATP releases energy?",
    options: [
      { id: 'a', text: 'It turns into DNA' },
      { id: 'b', text: 'It loses a phosphate group and becomes ADP' },
      { id: 'c', text: 'It absorbs light' },
      { id: 'd', text: 'It creates water' }
    ],
    correctAnswerId: 'b'
  },

  // --- Algorithms Chain ---
  {
    id: 'binary-search',
    topic: "Algorithms",
    category: 'Computer Science',
    title: "Binary Search",
    content: 'A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
    relatedCardId: 'linear-search',
    question: 'What is a strict requirement for an array before you can use binary search on it?',
    options: [
      { id: 'a', text: 'It must contain only numbers.' },
      { id: 'b', text: 'It must be sorted.' },
      { id: 'c', text: 'It must have an even number of elements.' },
      { id: 'd', text: 'It must not contain duplicates.' }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'linear-search',
    topic: "Algorithms",
    category: 'Computer Science',
    title: "Linear Search",
    content: "A simple search algorithm that checks every element in the list sequentially until a match is found or the whole list has been searched.",
    relatedCardId: 'big-o',
    question: "In the worst-case scenario, how many elements must linear search check in an array of size n?",
    options: [
      { id: 'a', text: '1 element' },
      { id: 'b', text: 'log(n) elements' },
      { id: 'c', text: 'n/2 elements' },
      { id: 'd', text: 'n elements' }
    ],
    correctAnswerId: 'd'
  },
  {
    id: 'big-o',
    topic: "Algorithms",
    category: 'Computer Science',
    title: "Big O Notation",
    content: "Mathematical notation used to classify algorithms according to how their run time or space requirements grow as the input size grows.",
    relatedCardId: null,
    question: "What is the time complexity of Binary Search in Big O notation?",
    options: [
      { id: 'a', text: 'O(1)' },
      { id: 'b', text: 'O(log n)' },
      { id: 'c', text: 'O(n)' },
      { id: 'd', text: 'O(n^2)' }
    ],
    correctAnswerId: 'b'
  },

  // --- Geology Chain ---
  {
    id: 'water-cycle',
    topic: "Earth Science",
    category: 'Geology',
    title: "The Water Cycle",
    content: 'The continuous movement of water within the Earth and atmosphere, including evaporation, condensation, and precipitation.',
    relatedCardId: 'evaporation',
    question: 'Which process describes water vapor turning back into liquid water?',
    options: [
      { id: 'a', text: 'Evaporation' },
      { id: 'b', text: 'Precipitation' },
      { id: 'c', text: 'Condensation' },
      { id: 'd', text: 'Transpiration' }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'evaporation',
    topic: "Earth Science",
    category: 'Geology',
    title: "Evaporation",
    content: "The process of turning from liquid into vapor. It is a fundamental part of the water cycle, driven by thermal energy from the sun.",
    relatedCardId: 'condensation',
    question: "Evaporation only occurs when water reaches its boiling point. True or false?",
    options: [
      { id: 'a', text: 'True' },
      { id: 'b', text: 'False' }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'condensation',
    topic: "Earth Science",
    category: 'Geology',
    title: "Condensation",
    content: "The conversion of a vapor or gas to a liquid. In the water cycle, it's responsible for the formation of clouds.",
    relatedCardId: null,
    question: "Which of the following is an everyday example of condensation?",
    options: [
      { id: 'a', text: 'Water boiling in a pot' },
      { id: 'b', text: 'Ice melting on a counter' },
      { id: 'c', text: 'Dew forming on grass in the morning' },
      { id: 'd', text: 'Salt dissolving in water' }
    ],
    correctAnswerId: 'c'
  },

  // --- Electromagnetism Chain ---
  {
    id: 'electromagnetic-induction',
    topic: "Electromagnetism",
    category: 'Physics',
    title: "Electromagnetic Induction",
    content: 'The production of an electromotive force across an electrical conductor in a changing magnetic field.',
    relatedCardId: 'faradays-law',
    question: 'Who is primarily credited with the discovery of electromagnetic induction?',
    options: [
      { id: 'a', text: 'Albert Einstein' },
      { id: 'b', text: 'Isaac Newton' },
      { id: 'c', text: 'Michael Faraday' },
      { id: 'd', text: 'Nikola Tesla' }
    ],
    correctAnswerId: 'c'
  },
  {
    id: 'faradays-law',
    topic: "Electromagnetism",
    category: 'Physics',
    title: "Faraday's Law of Induction",
    content: "States that a changing magnetic environment within a loop of wire induces an electromotive force (EMF) in the wire.",
    relatedCardId: 'transformers',
    question: "According to Faraday's law, how can you increase the induced voltage in a coil?",
    options: [
      { id: 'a', text: 'Move the magnet slower' },
      { id: 'b', text: 'Use a weaker magnet' },
      { id: 'c', text: 'Decrease the number of turns in the coil' },
      { id: 'd', text: 'Increase the speed of the changing magnetic field' }
    ],
    correctAnswerId: 'd'
  },
  {
    id: 'transformers',
    topic: "Electromagnetism",
    category: 'Physics',
    title: "Transformers",
    content: "A passive electrical device that transfers electrical energy from one electrical circuit to another, used to step up or step down voltage.",
    relatedCardId: null,
    question: "Why do power grids use transformers to step up voltage for long-distance transmission?",
    options: [
      { id: 'a', text: 'To increase the speed of electrons' },
      { id: 'b', text: 'To reduce energy loss due to heating' },
      { id: 'c', text: 'To make the electricity safer' },
      { id: 'd', text: 'To convert AC to DC' }
    ],
    correctAnswerId: 'b'
  },

  // --- History Chain ---
  {
    id: 'ww2',
    topic: "Modern History",
    category: 'History',
    title: "World War II",
    content: 'A global conflict that lasted from 1939 to 1945, involving the vast majority of the world\'s nations.',
    relatedCardId: 'pearl-harbor',
    question: 'Which event is generally considered the start of World War II in Europe?',
    options: [
      { id: 'a', text: 'The attack on Pearl Harbor' },
      { id: 'b', text: 'The invasion of Poland' },
      { id: 'c', text: 'The signing of the Treaty of Versailles' },
      { id: 'd', text: 'The fall of France' }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'pearl-harbor',
    topic: "Modern History",
    category: 'History',
    title: "Attack on Pearl Harbor",
    content: "A surprise military strike by the Imperial Japanese Navy upon the United States against the naval base at Pearl Harbor on December 7, 1941.",
    relatedCardId: 'd-day',
    question: "What was the immediate consequence of the attack on Pearl Harbor?",
    options: [
      { id: 'a', text: 'The end of World War II' },
      { id: 'b', text: 'The US officially entered World War II' },
      { id: 'c', text: 'The invention of the atomic bomb' },
      { id: 'd', text: 'The signing of the Geneva Convention' }
    ],
    correctAnswerId: 'b'
  },
  {
    id: 'd-day',
    topic: "Modern History",
    category: 'History',
    title: "D-Day (Operation Overlord)",
    content: "The Allied invasion of Normandy on June 6, 1944. It was the largest seaborne invasion in history and began the liberation of German-occupied France.",
    relatedCardId: null,
    question: "Which beaches were targeted during the Normandy landings?",
    options: [
      { id: 'a', text: 'Omaha, Utah, Gold, Juno, Sword' },
      { id: 'b', text: 'Miami, Daytona, Palm, Cocoa' },
      { id: 'c', text: 'Brighton, Bournemouth, Blackpool' },
      { id: 'd', text: 'Iwo Jima, Okinawa, Saipan' }
    ],
    correctAnswerId: 'a'
  }
];

// Helper to get a random unrelated card (Legacy logic, can be removed but kept for compatibility)
export function getRandomUnrelatedCard(currentCardId: string): Flashcard {
  const availableCards = flashcards.filter(c => c.id !== currentCardId);
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
}

// 2D Grid structure for the feed
// Vertical lines = unrelated topics
// Horizontal lines = related cards within a topic
export const flashcardChains = [
  ['newton-1', 'newton-2', 'newton-3', 'momentum', 'impulse'], // Chain 1: Physics
  ['photosynthesis', 'cellular-respiration', 'atp'], // Chain 2: Plant Biology
  ['binary-search', 'linear-search', 'big-o'], // Chain 3: Algorithms
  ['water-cycle', 'evaporation', 'condensation'], // Chain 4: Geology
  ['electromagnetic-induction', 'faradays-law', 'transformers'], // Chain 5: Electromagnetism
  ['ww2', 'pearl-harbor', 'd-day'] // Chain 6: History
];
