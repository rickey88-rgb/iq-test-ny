export type QuestionDomain =
  | "abstract"
  | "numeric"
  | "verbal"
  | "relation"
  | "workingMemory"
  | "ruleId"
  | "logic";

type PatternFigure = {
  shape: "circle" | "triangle" | "diamond" | "ring";
  tone?: "cyan" | "violet" | "gold" | "neutral";
};

type McQuestion = {
  id: string;
  type: "mc";
  domain: QuestionDomain;
  prompt: string;
  options: string[];
  sequence?: (PatternFigure | null)[];
  figureOptions?: PatternFigure[];
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
export type MatrixLayout =
  | "center"
  | "horizontal2"
  | "horizontal3"
  | "diagonal2"
  | "diagonal3"
  | "vertical2"
  | "vertical3";

export type MatrixShape =
  | "circle"
  | "eye"
  | "diamond"
  | "square"
  | "triangle"
  | "ring";

export type MatrixFill =
  | "none"
  | "full"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export type MatrixMarker = "dot";

export type MatrixMarkerPosition =
  | "center"
  | "top"
  | "right"
  | "bottom"
  | "left";

export type MatrixCell = {
  layout?: MatrixLayout;

  shape?: MatrixShape;
  fill?: MatrixFill;
  rotation?: 0 | 90 | 180 | 270;

  marker?: MatrixMarker;
  markerPosition?: MatrixMarkerPosition;
};

export type MatrixQuestion = {
  id: string;
  type: "matrix";
  domain: QuestionDomain;
  prompt: string;
  grid: (MatrixCell | null)[];
  options: MatrixCell[];
  correctIndex: number;
};
export type Question = McQuestion | MemoryQuestion | MatrixQuestion;
export const QUESTIONS: Question[] = [
  {
  id: "q01",
  type: "mc",
  domain: "abstract",
  prompt: "Which figure completes the sequence?",
  options: ["●", "▲", "◆", "○"],
  sequence: [
    { shape: "circle", tone: "cyan" },
    { shape: "triangle", tone: "violet" },
    { shape: "circle", tone: "cyan" },
    { shape: "triangle", tone: "violet" },
    { shape: "circle", tone: "cyan" },
    { shape: "triangle", tone: "violet" },
    null,
  ],
  figureOptions: [
    { shape: "circle", tone: "cyan" },
    { shape: "triangle", tone: "violet" },
    { shape: "diamond", tone: "gold" },
    { shape: "ring", tone: "neutral" },
  ],
  correctIndex: 0,
},
 {
  id: "q02",
  type: "mc",
  domain: "numeric",
  prompt: "Continue the sequence: 5, 10, 15, ?",
  options: ["18", "20", "25", "30"],
  correctIndex: 1,
},
  {
  id: "q03",
  type: "matrix",
  domain: "abstract",
  prompt: "Which figure completes the pattern?",
  grid: [
    { layout: "center" },
    { layout: "horizontal2" },
    { layout: "horizontal3" },

    { layout: "center" },
    { layout: "diagonal2" },
    { layout: "diagonal3" },

    { layout: "center" },
    { layout: "vertical2" },
    null,
  ],
  options: [
    { layout: "vertical3" },   // correct
    { layout: "horizontal3" },
    { layout: "vertical2" },
    { layout: "diagonal3" },
  ],
  correctIndex: 0,
},
 {
  id: "q04",
  type: "matrix",
  domain: "abstract",
  prompt: "Which figure completes the pattern?",
  grid: [
    { layout: "center" },
    { layout: "center" },
    { layout: "center" },

    { layout: "horizontal2" },
    { layout: "diagonal2" },
    { layout: "vertical2" },

    { layout: "horizontal3" },
    { layout: "diagonal3" },
    null,
  ],
  options: [
    { layout: "vertical3" },   // correct
    { layout: "vertical2" },
    { layout: "diagonal3" },
    { layout: "horizontal3" },
  ],
  correctIndex: 0,
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
  type: "matrix",
  domain: "abstract",
  prompt: "Which symbol completes the pattern?",
  grid: [
    { shape: "circle", fill: "topLeft" },
    { shape: "circle", fill: "topRight" },
    { shape: "circle", fill: "top" },

    { shape: "circle", fill: "bottomLeft" },
    { shape: "circle", fill: "bottomRight" },
    { shape: "circle", fill: "bottom" },

    { shape: "circle", fill: "left" },
    { shape: "circle", fill: "right" },
    null,
  ],
  options: [
    { shape: "circle", fill: "full" },   // correct
    { shape: "circle", fill: "top" },
    { shape: "circle", fill: "left" },
    { shape: "circle", fill: "bottom" },
  ],
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
  type: "matrix",
  domain: "abstract",
  prompt: "Which tile completes the pattern?",
  grid: [
    { shape: "diamond", fill: "top", marker: "dot", markerPosition: "center" },
    { shape: "diamond", fill: "right", marker: "dot", markerPosition: "center" },
    { shape: "diamond", fill: "bottom", marker: "dot", markerPosition: "center" },

    { shape: "diamond", fill: "right", marker: "dot", markerPosition: "center" },
    { shape: "diamond", fill: "bottom", marker: "dot", markerPosition: "center" },
    { shape: "diamond", fill: "left", marker: "dot", markerPosition: "center" },

    { shape: "diamond", fill: "bottom", marker: "dot", markerPosition: "center" },
    { shape: "diamond", fill: "left", marker: "dot", markerPosition: "center" },
    null,
  ],
  options: [
    { shape: "diamond", fill: "top", marker: "dot", markerPosition: "center" }, // correct
    { shape: "diamond", fill: "right", marker: "dot", markerPosition: "center" },
    { shape: "diamond", fill: "bottom", marker: "dot", markerPosition: "center" },
    { shape: "diamond", fill: "full", marker: "dot", markerPosition: "center" },
  ],
  correctIndex: 0,
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
  type: "matrix",
  domain: "abstract",
  prompt: "Which figure completes the pattern?",
  grid: [
    { shape: "square", fill: "topLeft" },
    { shape: "square", fill: "topRight" },
    { shape: "square", fill: "bottomRight" },

    { shape: "circle", fill: "topLeft" },
    { shape: "circle", fill: "topRight" },
    { shape: "circle", fill: "bottomRight" },

    { shape: "diamond", fill: "topLeft" },
    { shape: "diamond", fill: "topRight" },
    null,
  ],
  options: [
    { shape: "diamond", fill: "topLeft" },
    { shape: "diamond", fill: "bottomLeft" },
    { shape: "diamond", fill: "bottomRight" },
    { shape: "diamond", fill: "topRight" },
  ],
  correctIndex: 2,
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
  type: "matrix",
  domain: "abstract",
  prompt: "Which figure completes the pattern?",
  grid: [
    { shape: "ring", fill: "top", marker: "dot", markerPosition: "left" },
    { shape: "ring", fill: "right", marker: "dot", markerPosition: "top" },
    { shape: "ring", fill: "bottom", marker: "dot", markerPosition: "right" },

    { shape: "ring", fill: "right", marker: "dot", markerPosition: "bottom" },
    { shape: "ring", fill: "bottom", marker: "dot", markerPosition: "left" },
    { shape: "ring", fill: "left", marker: "dot", markerPosition: "top" },

    { shape: "ring", fill: "bottom", marker: "dot", markerPosition: "right" },
    { shape: "ring", fill: "left", marker: "dot", markerPosition: "bottom" },
    null,
  ],
  options: [
    { shape: "ring", fill: "top", marker: "dot", markerPosition: "right" },
    { shape: "ring", fill: "top", marker: "dot", markerPosition: "left" },
    { shape: "ring", fill: "left", marker: "dot", markerPosition: "left" },
    { shape: "ring", fill: "bottom", marker: "dot", markerPosition: "left" },
  ],
  correctIndex: 1,
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
  type: "matrix",
  domain: "abstract",
  prompt: "Which figure completes the pattern?",
  grid: [
    { shape: "diamond", fill: "top", marker: "dot", markerPosition: "left" },
    { shape: "diamond", fill: "right", marker: "dot", markerPosition: "top" },
    { shape: "diamond", fill: "bottom", marker: "dot", markerPosition: "right" },

    { shape: "diamond", fill: "right", marker: "dot", markerPosition: "bottom" },
    { shape: "diamond", fill: "bottom", marker: "dot", markerPosition: "left" },
    { shape: "diamond", fill: "left", marker: "dot", markerPosition: "top" },

    { shape: "diamond", fill: "bottom", marker: "dot", markerPosition: "right" },
    { shape: "diamond", fill: "left", marker: "dot", markerPosition: "bottom" },
    null,
  ],
  options: [
    { shape: "diamond", fill: "top", marker: "dot", markerPosition: "right" },
    { shape: "diamond", fill: "left", marker: "dot", markerPosition: "left" },
    { shape: "diamond", fill: "top", marker: "dot", markerPosition: "left" },
    { shape: "diamond", fill: "bottom", marker: "dot", markerPosition: "left" },
  ],
  correctIndex: 2,
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
  domain: "numeric",
  prompt:
    "△ + ○ = 8\n○ + □ = 12\n△ + □ = 10\n\nWhat is:\n△ × □ − ○ = ?",
  options: ["12", "16", "20", "24"],
  correctIndex: 1,
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