export type QuestionDomain =
  | "abstract"
  | "numeric"
  | "verbal"
  | "relation"
  | "workingMemory"
  | "ruleId"
  | "logic";

export type MCQuestion = {
  id: string;
  type: "mc";
  domain: QuestionDomain;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type MemoryQuestion = {
  id: string;
  type: "memory";
  domain: QuestionDomain;
  sequence: string[];
  showMs: number;
  questionText: string;
  options: string[];
  correctIndex: number;
};

export type Question = MCQuestion | MemoryQuestion;
export const QUESTIONS: Question[] = [
  {
  id: "q01",
  type: "mc",
  domain: "abstract",
  prompt: "● ▲ ● ▲ ● ▲ ? ? ?",
  options: ["● ▲ ●", "▲ ● ▲", "● ● ▲", "▲ ▲ ●"],
  correctIndex: 0,
},
  {
    id: "q02",
    type: "mc",
    domain: "numeric",
    prompt: "5, 10, 15, ?",
    options: ["18", "20", "25", "30"],
    correctIndex: 1,
  },
  {
    id: "q03",
    type: "mc",
    domain: "verbal",
    prompt: "All cats are animals.\nAll animals need food.\nWhich statement must be true?",
    options: [
      "All cats need food",
      "All animals are cats",
      "No cats are animals",
      "Some cats are not animals",
    ],
    correctIndex: 0,
  },
  {
    id: "q04",
    type: "mc",
    domain: "relation",
    prompt: "Pen is to write as scissors are to:",
    options: ["Paper", "Cut", "Hand", "Metal"],
    correctIndex: 1,
  },

  {
    id: "q05",
    type: "mc",
    domain: "logic",
    prompt: "You overtake the person in 2nd place.\nWhat place are you in now?",
    options: ["1st", "2nd", "3rd", "4th"],
    correctIndex: 1,
  },

  {
    id: "q6",
    type: "mc",
    domain: "ruleId",
    prompt:
      "Examples (follow the same rule):\nABBA\nNOON\nELLE\n\nWhich option follows the same rule?",
    options: ["ABCD", "KAYAK", "HELLO", "WORLD"],
    correctIndex: 1,
  },
  {
    id: "q07",
    type: "mc",
    domain: "logic",
    prompt: "If all A are B and all B are C — what follows?",
    options: ["All A are C", "All C are A", "No A are C", "Some A are not C"],
    correctIndex: 0,
  },
  {
    id: "q08",
    type: "mc",
    domain: "relation",
    prompt: "Eye is to see as ear is to:",
    options: ["Sound", "Speak", "Hear", "Music"],
    correctIndex: 2,
  },

  {
  id: "q09",
  type: "mc",
  domain: "numeric",
  prompt:
    "A pen and an eraser cost $22 in total.\nThe pen costs $20 more than the eraser.\nHow much does the eraser cost?",
  options: ["$1", "$2", "$10", "$11"],
  correctIndex: 0,
  },

  {
    id: "q10",
    type: "mc",
    domain: "numeric",
    prompt: "2→4\n3→6\n4→8\n5→?",
    options: ["9", "10", "12", "15"],
    correctIndex: 1,
  },

  {
    id: "q11",
    type: "mc",
    domain: "logic",
    prompt: 'A person says:\n"I am lying right now."\nIs that statement possible?',
    options: ["Yes", "No", "Only if joking", "Cannot be determined"],
    correctIndex: 1,
  },

  {
    id: "q12",
    type: "mc",
    domain: "numeric",
    prompt: "4, 7, 10, 13, ?",
    options: ["15", "16", "17", "18"],
    correctIndex: 1,
  },

  {
    id: "q13",
    type: "mc",
    domain: "verbal",
    prompt:
      "All plins are zorps.\nSome zorps are blaks.\nWhat is logically certain?",
    options: [
      "All plins are blaks",
      "Some plins are blaks",
      "No plins are blaks",
      "It cannot be determined",
    ],
    correctIndex: 3,
  },
  {
    id: "q14",
    type: "mc",
    domain: "relation",
    prompt: "Key is to lock as password is to:",
    options: ["Security", "Computer", "Login", "Access"],
    correctIndex: 2,
  },
  {
    id: "q15",
    type: "memory",
    domain: "workingMemory",
    sequence: ["C", "8", "■", "A", "5"],
    showMs: 3000,
    questionText: "Which option shows the same order?",
    options: [
      "C – 8 – ■ – A – 5",
      "C – ■ – 8 – A – 5",
      "8 – C – ■ – A – 5",
      "C – 8 – A – ■ – 5",
    ],
    correctIndex: 0,
  },

  {
  id: "q16",
  type: "mc",
  domain: "abstract",
  prompt: "▲ ▲ ●   ▲ ▲ ●   ? ? ?",
  options: ["▲ ▲ ●", "▲ ● ▲", "● ▲ ▲", "▲ ▲ ▲"],
  correctIndex: 0,
},

  {
    id: "q17",
    type: "mc",
    domain: "ruleId",
    prompt:
      "Rule A (examples):\n2 → 4\n3 → 6\n5 → 10\n\nSwitch to Rule B: output = input + 3.\nWhich option fits Rule B?",
    options: ["4 → 7", "4 → 8", "4 → 10", "4 → 5"],
    correctIndex: 0,
  },

  {
    id: "q18",
    type: "mc",
    domain: "logic",
    prompt:
      "Three people sit at a table.\nAnna looks at Brian.\nBrian looks at Clara.\nExactly one of them is intelligent.\n\nIs an intelligent person looking at a less intelligent person?",
    options: ["Yes", "No", "Cannot be determined", "Only sometimes"],
    correctIndex: 0,
  },

    {
    id: "q19",
    type: "mc",
    domain: "logic",
    prompt: "If some A are B, all B are C, and no C are D — what must be true?",
    options: ["Some A are C", "Some A are D", "All A are C", "No A are D"],
    correctIndex: 0,
  },

  {
    id: "q20",
    type: "mc",
    domain: "relation",
    prompt: "Seed is to tree as idea is to:",
    options: ["Thought", "Plan", "Result", "Development"],
    correctIndex: 3,
  },

  {
    id: "q21",
    type: "memory",
    domain: "workingMemory",
    sequence: ["A", "4", "●", "B", "7"],
    showMs: 3000,
    questionText: "Which option shows the same order?",
    options: [
      "A – ● – 4 – B – 7",
      "A – 4 – ● – B – 7",
      "4 – A – ● – B – 7",
      "A – 4 – B – ● – 7",
    ],
    correctIndex: 1,
  },

  {
    id: "q22",
    type: "mc",
    domain: "numeric",
    prompt:
      "Choose one:\nA) $1,000,000 today\nB) $1 doubled every day for 20 days\n\nWhich is worth more?",
    options: ["A", "B", "They are equal", "Cannot be determined"],
    correctIndex: 1,
  },

  {
    id: "q23",
    type: "mc",
    domain: "abstract",
    prompt: "▲ ▲ ●   ▲ ● ●   ● ● ▲   ?",
    options: ["▲ ▲ ●", "▲ ● ●", "● ● ▲", "● ▲ ▲"],
    correctIndex: 3,
  },

  {
    id: "q24",
    type: "mc",
    domain: "logic",
    prompt:
      "If it rains, the ground gets wet.\nThe ground is not wet.\nWhat follows logically?",
    options: [
      "It rained",
      "It did not rain",
      "It may have rained",
      "It cannot be determined",
    ],
    correctIndex: 1,
  },

  {
    id: "q25",
    type: "memory",
    domain: "workingMemory",
    sequence: ["B", "7", "▲", "4", "C", "3"],
    showMs: 2500,
    questionText: "Which option shows the same order?",
    options: [
      "B – 7 – ▲ – 4 – C – 3",
      "B – ▲ – 7 – 4 – C – 3",
      "7 – B – ▲ – 4 – C – 3",
      "B – 7 – ▲ – C – 4 – 3",
    ],
    correctIndex: 0,
  },

  {
    id: "q26",
    type: "mc",
    domain: "ruleId",
    prompt:
      "Rule A (examples):\nCAT → TAC\nDOG → GOD\n\nSwitch to Rule B: move the last letter to the front.\nWhich option fits Rule B?",
    options: ["LAMP → AMPL", "LAMP → PLAM", "LAMP → LMAP", "LAMP → LAMP"],
    correctIndex: 1,
  },

  {
    id: "q27",
    type: "mc",
    domain: "numeric",
    prompt: "1, 4, 10, 22, ?",
    options: ["34", "40", "46", "52"],
    correctIndex: 2,
  },

  {
    id: "q28",
    type: "mc",
    domain: "abstract",
    prompt: "■ ● ●   ■ ■ ●   ● ■ ■   ?",
    options: ["■ ● ●", "■ ■ ●", "● ■ ■", "● ● ■"],
    correctIndex: 3,
  },

  {
    id: "q29",
    type: "memory",
    domain: "workingMemory",
    sequence: ["A", "B", "4", "3", "▲", "●", "9"],
    showMs: 2000,
    questionText: "Which option shows the same order?",
    options: [
      "A – B – 4 – 3 – ▲ – ● – 9",
      "A – B – 3 – 4 – ▲ – ● – 9",
      "A – B – 4 – 3 – ● – ▲ – 9",
      "B – A – 4 – 3 – ▲ – ● – 9",
    ],
    correctIndex: 0,
  },

  {
    id: "q30",
    type: "mc",
    domain: "relation",
    prompt: "Roots are to soil as lungs are to:",
    options: ["Oxygen", "Air", "Blood", "Body"],
    correctIndex: 1,
  },

  {
    id: "q31",
    type: "mc",
    domain: "logic",
    prompt:
      "On an island, truth-tellers always tell the truth, and liars always lie.\nYou ask someone: “Are you a liar?”\nThey answer: “Yes.”\n\nWhat are they?",
    options: [
      "Truth-teller",
      "Liar",
      "Impossible scenario",
      "Cannot be determined",
    ],
    correctIndex: 2,
  },

  {
    id: "q32",
    type: "mc",
    domain: "ruleId",
    prompt: "Which rule best describes the series?\n2, 5, 10, 17, 26",
    options: [
      "Increasing odd differences",
      "n² + 1",
      "n × (n + 1)",
      "Doubling + 1",
    ],
    correctIndex: 0,
  },

  {
    id: "q33",
    type: "mc",
    domain: "abstract",
    prompt: "■ ● ▲   ● ▲ ■   ▲ ■ ●   ?",
    options: ["■ ● ▲", "● ▲ ■", "▲ ■ ●", "■ ▲ ●"],
    correctIndex: 0,
  },

  {
    id: "q34",
    type: "mc",
    domain: "numeric",
    prompt: "1→2\n2→6\n3→12\n4→20\n5→?",
    options: ["25", "30", "32", "35"],
    correctIndex: 1,
  },

  {
    id: "q35",
    type: "mc",
    domain: "logic",
    prompt:
      'Exactly one statement is true:\n1) “2 is true”\n2) “3 is true”\n3) “1 is false”\nWhich statement is true?',
    options: ["1", "2", "3", "None"],
    correctIndex: 2,
  },

  {
    id: "q36",
    type: "mc",
    domain: "ruleId",
    prompt: "Which option breaks the pattern?",
    options: ["3–6–12", "5–10–20", "7–14–28", "9–18–35"],
    correctIndex: 3,
  },

  {
    id: "q37",
    type: "mc",
    domain: "abstract",
    prompt: "▲ ● ■   ■ ▲ ●   ● ■ ▲   ?",
    options: ["▲ ● ■", "■ ▲ ●", "● ■ ▲", "▲ ■ ●"],
    correctIndex: 0,
  },

  {
    id: "q38",
    type: "memory",
    domain: "workingMemory",
    sequence: ["A", "3", "B", "4", "▲", "●", "A"],
    showMs: 2000,
    questionText: "Which option shows the same order?",
    options: [
      "A – 3 – B – 4 – ▲ – ● – A",
      "A – 3 – B – ▲ – 4 – ● – A",
      "A – B – 3 – 4 – ▲ – ● – A",
      "A – 3 – B – 4 – ● – ▲ – A",
    ],
    correctIndex: 0,
  },

  {
    id: "q39",
    type: "mc",
    domain: "ruleId",
    prompt:
      "Rule A (examples):\n1 3 5 → 9\n2 4 6 → 12\n\nSwitch to Rule B: answer = (middle number) × 2.\nWhich option fits Rule B?",
    options: ["3 7 9 → 14", "3 7 9 → 19", "3 7 9 → 16", "3 7 9 → 7"],
    correctIndex: 0,
  },

  {
    id: "q40",
    type: "mc",
    domain: "logic",
    prompt:
      "80% of people think they are smarter than average.\nIf that were true — what does it mean?",
    options: [
      "Most people are correct",
      "It is mathematically impossible",
      "The average is wrong",
      "It says nothing",
    ],
    correctIndex: 1,
  },
] as const;

export const TOTAL_QUESTIONS = QUESTIONS.length;