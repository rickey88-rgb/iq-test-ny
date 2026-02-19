export type QuestionDomain = 'abstract'|'numeric'|'verbal'|'relation'|'workingMemory'|'ruleId'|'logic';
export type MCQuestion = {id:string; type:'mc'; domain:QuestionDomain; prompt:string; options:string[]; correctIndex:number};
export type MemoryQuestion = {id:string; type:'memory'; domain:QuestionDomain; sequence:string[]; showMs:number; questionText:string; options:string[]; correctIndex:number};
export type Question = MCQuestion | MemoryQuestion;

export const QUESTIONS: Question[] = [
  {
    "id": "q01",
    "type": "mc",
    "domain": "abstract",
    "prompt": "\u25cf \u25b2 \u25cf \u25b2 \u25cf \u25b2 ?",
    "options": [
      "\u25cf",
      "\u25b2",
      "\u25a0",
      "\u25cf \u25b2"
    ],
    "correctIndex": 0
  },
  {
    "id": "q02",
    "type": "mc",
    "domain": "numeric",
    "prompt": "5, 10, 15, ?",
    "options": [
      "18",
      "20",
      "25",
      "30"
    ],
    "correctIndex": 1
  },
  {
    "id": "q03",
    "type": "mc",
    "domain": "verbal",
    "prompt": "All cats are animals.\nAll animals need food.\nWhich statement must be true?",
    "options": [
      "All cats need food",
      "All animals are cats",
      "No cats are animals",
      "Some cats are not animals"
    ],
    "correctIndex": 0
  },
  {
    "id": "q04",
    "type": "mc",
    "domain": "relation",
    "prompt": "Pen is to write as scissors are to:",
    "options": [
      "Paper",
      "Cut",
      "Hand",
      "Metal"
    ],
    "correctIndex": 1
  },
  {
    "id": "q05",
    "type": "mc",
    "domain": "abstract",
    "prompt": "\u25a0 \u25a0 \u25cf   \u25a0 \u25a0 \u25cf   ?",
    "options": [
      "\u25a0",
      "\u25cf",
      "\u25a0 \u25cf",
      "\u25cf \u25a0"
    ],
    "correctIndex": 1
  },
  {
   "id": "q6",
  "type": "mc",
  "domain": "ruleId",
  "prompt": "Examples (follow the same rule):\nABBA\nNOON\nELLE\n\nWhich option follows the same rule?",
  "options": [
    "ABCD",
    "KAYAK",
    "HELLO",
    "WORLD"
  ],
  "correctIndex": 1
  },
  {
    "id": "q07",
    "type": "mc",
    "domain": "logic",
    "prompt": "If all A are B and all B are C \u2014 what follows?",
    "options": [
      "All A are C",
      "All C are A",
      "No A are C",
      "Some A are not C"
    ],
    "correctIndex": 0
  },
  {
    "id": "q08",
    "type": "mc",
    "domain": "relation",
    "prompt": "Eye is to see as ear is to:",
    "options": [
      "Sound",
      "Speak",
      "Hear",
      "Music"
    ],
    "correctIndex": 2
  },
  {
    "id": "q09",
    "type": "mc",
    "domain": "abstract",
    "prompt": "\u25b2 \u25b2 \u25cf \u25cf   \u25b2 \u25b2 \u25cf \u25cf   ?",
    "options": [
      "\u25b2",
      "\u25cf",
      "\u25b2 \u25b2",
      "\u25cf \u25cf"
    ],
    "correctIndex": 2
  },
  {
    "id": "q10",
    "type": "mc",
    "domain": "numeric",
    "prompt": "2\u21924\n3\u21926\n4\u21928\n5\u2192?",
    "options": [
      "9",
      "10",
      "12",
      "15"
    ],
    "correctIndex": 1
  },
  {
    "id": "q11",
    "type": "mc",
    "domain": "abstract",
    "prompt": "\u25a0 \u25cf \u25a0 \u25cf \u25a0 \u25cf ?",
    "options": [
      "\u25a0",
      "\u25cf",
      "\u25a0 \u25cf",
      "\u25cf \u25a0"
    ],
    "correctIndex": 1
  },
  {
    "id": "q12",
    "type": "mc",
    "domain": "numeric",
    "prompt": "4, 7, 10, 13, ?",
    "options": [
      "15",
      "16",
      "17",
      "18"
    ],
    "correctIndex": 2
  },
  {
    "id": "q13",
    "type": "mc",
    "domain": "verbal",
    "prompt": "All plins are zorps.\nSome zorps are blaks.\nWhat is logically certain?",
    "options": [
      "All plins are blaks",
      "Some plins are blaks",
      "No plins are blaks",
      "It cannot be determined"
    ],
    "correctIndex": 3
  },
  {
    "id": "q14",
    "type": "mc",
    "domain": "relation",
    "prompt": "Key is to lock as password is to:",
    "options": [
      "Security",
      "Computer",
      "Login",
      "Access"
    ],
    "correctIndex": 2
  },
  {
    "id": "q15",
    "type": "memory",
    "domain": "workingMemory",
    "sequence": [
      "C",
      "8",
      "\u25a0",
      "A",
      "5"
    ],
    "showMs": 3000,
    "questionText": "Which option shows the same order?",
    "options": [
      "C \u2013 8 \u2013 \u25a0 \u2013 A \u2013 5",
      "C \u2013 \u25a0 \u2013 8 \u2013 A \u2013 5",
      "8 \u2013 C \u2013 \u25a0 \u2013 A \u2013 5",
      "C \u2013 8 \u2013 A \u2013 \u25a0 \u2013 5"
    ],
    "correctIndex": 0
  },
  {
    "id": "q16",
    "type": "mc",
    "domain": "abstract",
    "prompt": "\u25b2 \u25b2 \u25cf   \u25b2 \u25b2 \u25cf   \u25b2 \u25b2 ?",
    "options": [
      "\u25b2",
      "\u25cf",
      "\u25b2 \u25cf",
      "\u25cf \u25cf"
    ],
    "correctIndex": 1
  },
  {
    "id": "q17",
  "type": "mc",
  "domain": "ruleId",
  "prompt": "Rule A (examples):\n2 \u2192 4\n3 \u2192 6\n5 \u2192 10\n\nSwitch to Rule B: output = input + 3.\nWhich option fits Rule B?",
  "options": [
    "4 \u2192 7",
    "4 \u2192 8",
    "4 \u2192 10",
    "4 \u2192 5"
  ],
  "correctIndex": 0
  },
  {
    "id": "q18",
  "type": "mc",
  "domain": "ruleId",
  "prompt": "Examples (follow the same rule):\n2 \u2192 6\n3 \u2192 9\n4 \u2192 12\n\nWhich option follows the same rule?",
  "options": [
    "5 \u2192 15",
    "5 \u2192 14",
    "5 \u2192 12",
    "5 \u2192 10"
  ],
  "correctIndex": 0
  },
  {
    "id": "q19",
    "type": "mc",
    "domain": "logic",
    "prompt": "If some A are B, all B are C, and no C are D \u2014 what must be true?",
    "options": [
      "Some A are D",
      "No A are D",
      "All A are C",
      "It cannot be determined"
    ],
    "correctIndex": 3
  },
  {
    "id": "q20",
    "type": "mc",
    "domain": "relation",
    "prompt": "Seed is to tree as idea is to:",
    "options": [
      "Thought",
      "Plan",
      "Result",
      "Development"
    ],
    "correctIndex": 3
  },
  {
    "id": "q21",
    "type": "memory",
    "domain": "workingMemory",
    "sequence": [
      "A",
      "4",
      "\u25cf",
      "B",
      "7"
    ],
    "showMs": 3000,
    "questionText": "Which option shows the same order?",
    "options": [
      "A \u2013 \u25cf \u2013 4 \u2013 B \u2013 7",
      "A \u2013 4 \u2013 \u25cf \u2013 B \u2013 7",
      "4 \u2013 A \u2013 \u25cf \u2013 B \u2013 7",
      "A \u2013 4 \u2013 B \u2013 \u25cf \u2013 7"
    ],
    "correctIndex": 1
  },
  {
    "id": "q22",
    "type": "mc",
    "domain": "numeric",
    "prompt": "3, 6, 11, 18, ?",
    "options": [
      "25",
      "27",
      "29",
      "31"
    ],
    "correctIndex": 0
  },
  {
    "id": "q23",
    "type": "mc",
    "domain": "abstract",
    "prompt": "\u25b2 \u25b2 \u25cf   \u25b2 \u25cf \u25cf   \u25cf \u25cf \u25b2   ?",
    "options": [
      "\u25b2 \u25b2 \u25cf",
      "\u25b2 \u25cf \u25cf",
      "\u25cf \u25cf \u25b2",
      "\u25cf \u25b2 \u25b2"
    ],
    "correctIndex": 2
  },
  {
    "id": "q24",
    "type": "mc",
    "domain": "logic",
    "prompt": "If it rains, the ground gets wet.\nThe ground is not wet.\nWhat follows logically?",
    "options": [
      "It rained",
      "It did not rain",
      "It may have rained",
      "It cannot be determined"
    ],
    "correctIndex": 1
  },
  {
    "id": "q25",
    "type": "memory",
    "domain": "workingMemory",
    "sequence": [
      "B",
      "7",
      "\u25b2",
      "4",
      "C",
      "3"
    ],
    "showMs": 2500,
    "questionText": "Which option shows the same order?",
    "options": [
      "B \u2013 7 \u2013 \u25b2 \u2013 4 \u2013 C \u2013 3",
      "B \u2013 \u25b2 \u2013 7 \u2013 4 \u2013 C \u2013 3",
      "7 \u2013 B \u2013 \u25b2 \u2013 4 \u2013 C \u2013 3",
      "B \u2013 7 \u2013 \u25b2 \u2013 C \u2013 4 \u2013 3"
    ],
    "correctIndex": 0
  },
  {
   "id": "q26",
  "type": "mc",
  "domain": "ruleId",
  "prompt": "Rule A (examples):\nCAT \u2192 TAC\nDOG \u2192 GOD\n\nSwitch to Rule B: move the last letter to the front.\nWhich option fits Rule B?",
  "options": [
    "LAMP \u2192 AMPL",
    "LAMP \u2192 PLAM",
    "LAMP \u2192 LMAP",
    "LAMP \u2192 LAMP"
  ],
  "correctIndex": 1
  },
  {
    "id": "q27",
    "type": "mc",
    "domain": "numeric",
    "prompt": "1, 4, 10, 22, ?",
    "options": [
      "34",
      "40",
      "46",
      "52"
    ],
    "correctIndex": 2
  },
  {
    "id": "q28",
    "type": "mc",
    "domain": "abstract",
    "prompt": "\u25a0 \u25cf \u25cf   \u25a0 \u25a0 \u25cf   \u25cf \u25a0 \u25a0   ?",
    "options": [
      "\u25a0 \u25cf \u25cf",
      "\u25a0 \u25a0 \u25cf",
      "\u25cf \u25a0 \u25a0",
      "\u25cf \u25cf \u25a0"
    ],
    "correctIndex": 2
  },
  {
    "id": "q29",
    "type": "memory",
    "domain": "workingMemory",
    "sequence": [
      "A",
      "B",
      "4",
      "3",
      "\u25b2",
      "\u25cf",
      "9"
    ],
    "showMs": 2000,
    "questionText": "Which option shows the same order?",
    "options": [
      "A \u2013 B \u2013 4 \u2013 3 \u2013 \u25b2 \u2013 \u25cf \u2013 9",
      "A \u2013 B \u2013 3 \u2013 4 \u2013 \u25b2 \u2013 \u25cf \u2013 9",
      "A \u2013 B \u2013 4 \u2013 3 \u2013 \u25cf \u2013 \u25b2 \u2013 9",
      "B \u2013 A \u2013 4 \u2013 3 \u2013 \u25b2 \u2013 \u25cf \u2013 9"
    ],
    "correctIndex": 0
  },
  {
    "id": "q30",
    "type": "mc",
    "domain": "relation",
    "prompt": "Roots are to soil as lungs are to:",
    "options": [
      "Oxygen",
      "Air",
      "Blood",
      "Body"
    ],
    "correctIndex": 1
  },
  {
    "id": "q31",
    "type": "memory",
    "domain": "workingMemory",
    "sequence": [
      "B",
      "A",
      "4",
      "3",
      "\u25b2",
      "\u25cf",
      "9"
    ],
    "showMs": 2000,
    "questionText": "Which option shows the same order?",
    "options": [
      "B \u2013 A \u2013 4 \u2013 3 \u2013 \u25b2 \u2013 \u25cf \u2013 9",
      "A \u2013 B \u2013 4 \u2013 3 \u2013 \u25b2 \u2013 \u25cf \u2013 9",
      "B \u2013 A \u2013 3 \u2013 4 \u2013 \u25b2 \u2013 \u25cf \u2013 9",
      "B \u2013 A \u2013 4 \u2013 3 \u2013 \u25cf \u2013 \u25b2 \u2013 9"
    ],
    "correctIndex": 0
  },
  {
    "id": "q32",
    "type": "mc",
    "domain": "ruleId",
    "prompt": "Which rule best describes the series?\n2, 5, 10, 17, 26",
    "options": [
      "Increasing odd differences",
      "n\u00b2 + 1",
      "n \u00d7 (n + 1)",
      "Doubling + 1"
    ],
    "correctIndex": 0
  },
  {
    "id": "q33",
    "type": "mc",
    "domain": "abstract",
    "prompt": "\u25a0 \u25cf \u25b2   \u25cf \u25b2 \u25a0   \u25b2 \u25a0 \u25cf   ?",
    "options": [
      "\u25a0 \u25cf \u25b2",
      "\u25cf \u25b2 \u25a0",
      "\u25b2 \u25a0 \u25cf",
      "\u25a0 \u25b2 \u25cf"
    ],
    "correctIndex": 0
  },
  {
    "id": "q34",
    "type": "mc",
    "domain": "numeric",
    "prompt": "1\u21922\n2\u21926\n3\u219212\n4\u219220\n5\u2192?",
    "options": [
      "25",
      "30",
      "32",
      "35"
    ],
    "correctIndex": 1
  },
  {
    "id": "q35",
    "type": "mc",
    "domain": "logic",
    "prompt": "Exactly one statement is true:\n1) \u201c2 is true\u201d\n2) \u201c3 is true\u201d\n3) \u201c1 is false\u201d\nWhich statement is true?",
    "options": [
      "1",
      "2",
      "3",
      "None"
    ],
    "correctIndex": 2
  },
  {
     "id": "q36",
  "type": "mc",
  "domain": "ruleId",
  "prompt": "Examples (follow the same rule):\nABBA\nCDDC\nXYYX\n\nWhich option follows the same rule?",
  "options": [
    "ABCA",
    "QTTQ",
    "KLMK",
    "MMMN"
  ],
  "correctIndex": 1
  },
  {
    "id": "q37",
    "type": "mc",
    "domain": "abstract",
    "prompt": "\u25b2 \u25cf \u25a0   \u25a0 \u25b2 \u25cf   \u25cf \u25a0 \u25b2   ?",
    "options": [
      "\u25b2 \u25cf \u25a0",
      "\u25a0 \u25b2 \u25cf",
      "\u25cf \u25a0 \u25b2",
      "\u25b2 \u25a0 \u25cf"
    ],
    "correctIndex": 0
  },
  {
    "id": "q38",
    "type": "memory",
    "domain": "workingMemory",
    "sequence": [
      "A",
      "3",
      "B",
      "4",
      "\u25b2",
      "\u25cf",
      "A"
    ],
    "showMs": 2000,
    "questionText": "Which option shows the same order?",
    "options": [
      "A \u2013 3 \u2013 B \u2013 4 \u2013 \u25b2 \u2013 \u25cf \u2013 A",
      "A \u2013 3 \u2013 B \u2013 \u25b2 \u2013 4 \u2013 \u25cf \u2013 A",
      "A \u2013 B \u2013 3 \u2013 4 \u2013 \u25b2 \u2013 \u25cf \u2013 A",
      "A \u2013 3 \u2013 B \u2013 4 \u2013 \u25cf \u2013 \u25b2 \u2013 A"
    ],
    "correctIndex": 0
  },
  {
    "id": "q39",
  "type": "mc",
  "domain": "ruleId",
  "prompt": "Rule A (examples):\n1 3 5 \u2192 9\n2 4 6 \u2192 12\n\nSwitch to Rule B: answer = (middle number) \u00d7 2.\nWhich option fits Rule B?",
  "options": [
    "3 7 9 \u2192 14",
    "3 7 9 \u2192 19",
    "3 7 9 \u2192 16",
    "3 7 9 \u2192 7"
  ],
  "correctIndex": 0
  },
  {
    "id": "q40",
    "type": "mc",
    "domain": "logic",
    "prompt": "Exactly one statement is true:\nA: \u201cB is false\u201d\nB: \u201cC is true\u201d\nC: \u201cA is true\u201d\nWhich is true?",
    "options": [
      "A",
      "B",
      "C",
      "None"
    ],
    "correctIndex": 2
  }
] as const;

export const TOTAL_QUESTIONS = QUESTIONS.length;
