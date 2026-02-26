export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    "id": "delais",
    "question": "Quels sont les délais ?",
    "answer": "Livraison rapide selon la prestation, avec priorisation possible."
  },
  {
    "id": "lieu",
    "question": "Où se déroule le shooting ?",
    "answer": "Extérieur ou sur site client. On définit ça ensemble."
  },
  {
    "id": "retouche",
    "question": "Que comprend la retouche ?",
    "answer": "Retouche fine, colorimétrie, export web & impression."
  }
];
