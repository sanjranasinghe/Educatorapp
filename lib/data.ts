export type Subject = "English" | "Maths";

export type Tutor = {
  id: string;
  name: string;
  subject: Subject;
  accent: string;
  rateAud: number;
  experience: string;
  blurb: string;
  tags: string[];
};

export type LessonPackage = {
  id: string;
  title: string;
  subject: Subject;
  audience: string;
  sessions: number;
  outcomes: string[];
  priceAud: number;
};

export type TutorSlot = {
  id: string;
  tutorId: string;
  startsAt: string;
};

export const yearLevels = [
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
  "Year 7",
  "Year 8"
] as const;

export type YearLevel = (typeof yearLevels)[number];

export const tutors: Tutor[] = [
  {
    id: "mia-carter",
    name: "Mia Carter",
    subject: "English",
    accent: "Australian English",
    rateAud: 42,
    experience: "6 years with ESL and school literacy",
    blurb: "Helps students improve speaking confidence, grammar, reading, and writing for school.",
    tags: ["Pronunciation", "Writing", "Confidence"]
  },
  {
    id: "liam-nguyen",
    name: "Liam Nguyen",
    subject: "Maths",
    accent: "Australian English",
    rateAud: 48,
    experience: "8 years from primary to Year 10",
    blurb: "Supports Perth students from Years 1-8 with diagrams, guided practice, and step-by-step maths problem solving.",
    tags: ["WA Curriculum", "Fractions", "Problem solving"]
  },
  {
    id: "ava-singh",
    name: "Ava Singh",
    subject: "English",
    accent: "Neutral international",
    rateAud: 39,
    experience: "5 years for young learners",
    blurb: "Runs fun speaking and reading lessons for children learning English as a second language.",
    tags: ["Kids", "Reading", "Vocabulary"]
  }
];

export const lessonPackages: LessonPackage[] = [
  {
    id: "maths-year-1-4",
    title: "Maths Foundations Pack",
    subject: "Maths",
    audience: "Years 1-4 students in Western Australia",
    sessions: 4,
    outcomes: ["Number confidence", "Mental maths routines", "Parent-friendly progress updates"],
    priceAud: 168
  },
  {
    id: "maths-year-5-8",
    title: "Maths Skills Pack",
    subject: "Maths",
    audience: "Years 5-8 students in Western Australia",
    sessions: 4,
    outcomes: ["Fractions and decimals", "Reasoning and worded problems", "Weekly homework follow-up"],
    priceAud: 184
  },
  {
    id: "maths-private-hour",
    title: "Maths Private 1 Hour Lesson",
    subject: "Maths",
    audience: "One-off support for Years 1-8",
    sessions: 1,
    outcomes: ["Live tutor support", "Audio classroom", "Whiteboard guidance"],
    priceAud: 48
  },
  {
    id: "english-starter",
    title: "English Starter Pack",
    subject: "English",
    audience: "Beginner and intermediate students",
    sessions: 4,
    outcomes: ["Build speaking confidence", "Improve grammar", "Learn everyday vocabulary"],
    priceAud: 150
  },
  {
    id: "english-private-hour",
    title: "English Private 1 Hour Lesson",
    subject: "English",
    audience: "Custom one-off booking",
    sessions: 1,
    outcomes: ["Live tutor support", "Audio classroom", "Whiteboard guidance"],
    priceAud: 45
  }
];

export const roadmap = [
  {
    title: "Parent books first",
    detail: "Parents choose the student year level, tutor, and a one-hour lesson time in Australian dollars."
  },
  {
    title: "Join audio maths class",
    detail: "Teacher and student join the lesson room with live audio and a shared maths board."
  },
  {
    title: "Track WA progress",
    detail: "Lesson notes, homework, and next steps stay aligned to Years 1-8 maths goals."
  }
];

export const tutorSlots: TutorSlot[] = [
  {
    id: "mia-2026-03-30-1600",
    tutorId: "mia-carter",
    startsAt: "2026-03-30T16:00:00+08:00"
  },
  {
    id: "mia-2026-03-31-1800",
    tutorId: "mia-carter",
    startsAt: "2026-03-31T18:00:00+08:00"
  },
  {
    id: "liam-2026-03-30-1730",
    tutorId: "liam-nguyen",
    startsAt: "2026-03-30T17:30:00+08:00"
  },
  {
    id: "liam-2026-04-01-1900",
    tutorId: "liam-nguyen",
    startsAt: "2026-04-01T19:00:00+08:00"
  },
  {
    id: "ava-2026-03-29-1500",
    tutorId: "ava-singh",
    startsAt: "2026-03-29T15:00:00+08:00"
  },
  {
    id: "ava-2026-04-02-1700",
    tutorId: "ava-singh",
    startsAt: "2026-04-02T17:00:00+08:00"
  }
];
