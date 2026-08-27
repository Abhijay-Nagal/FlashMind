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

  // --- Unrelated Topics ---
  {
    id: 'photosynthesis',
    topic: "Plant Biology",
    category: 'Biology',
    title: "Photosynthesis",
    content: 'The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.',
    relatedCardId: null,
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
    id: 'binary-search',
    topic: "Algorithms",
    category: 'Computer Science',
    title: "Binary Search",
    content: 'A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
    relatedCardId: null,
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
    id: 'water-cycle',
    topic: "Earth Science",
    category: 'Geology',
    title: "The Water Cycle",
    content: 'The continuous movement of water within the Earth and atmosphere, including evaporation, condensation, and precipitation.',
    relatedCardId: null,
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
    id: 'electromagnetic-induction',
    topic: "Electromagnetism",
    category: 'Physics',
    title: "Electromagnetic Induction",
    content: 'The production of an electromotive force across an electrical conductor in a changing magnetic field.',
    relatedCardId: null,
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
    id: 'ww2',
    topic: "Modern History",
    category: 'History',
    title: "World War II",
    content: 'A global conflict that lasted from 1939 to 1945, involving the vast majority of the world\'s nations.',
    relatedCardId: null,
    question: 'Which event is generally considered the start of World War II in Europe?',
    options: [
      { id: 'a', text: 'The attack on Pearl Harbor' },
      { id: 'b', text: 'The invasion of Poland' },
      { id: 'c', text: 'The signing of the Treaty of Versailles' },
      { id: 'd', text: 'The fall of France' }
    ],
    correctAnswerId: 'b'
  }
];

// Helper to get a random unrelated card
export function getRandomUnrelatedCard(currentCardId: string): Flashcard {
  const availableCards = flashcards.filter(c => c.id !== currentCardId);
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
}
