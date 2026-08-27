export interface MCQOption {
  id: string;
  text: string;
}

export interface Flashcard {
  id: string;
  topic: string;
  category: string;
  title: string;
  content: string;
  relatedCardId: string | null;
  question: string;
  options: MCQOption[];
  correctAnswerId: string;
}
