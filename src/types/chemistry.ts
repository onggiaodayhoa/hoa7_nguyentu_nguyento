export type CognitiveLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung';

export interface ChemicalElement {
  z: number; // Atomic number
  symbol: string;
  nameIupac: string;
  nameTraditional?: string;
  latinName?: string;
  atomicMass: number; // in amu
  protons: number;
  electrons: number;
  neutrons: number;
  electronShells: number[]; // e.g. [2, 4] for Carbon
  period: number;
  group: string;
  valenceElectrons: number;
  funFact: string;
  bodyPercent?: number; // % in human body
}

export interface BlankItem {
  id: string;
  blankIndex: number;
  correctAnswer: string;
  acceptableAnswers?: string[];
  userAnswer?: string;
  hint?: string;
}

export interface TheoryQuestion {
  id: string;
  level: CognitiveLevel;
  title: string;
  topic:
    | 'rutherford_bohr'
    | 'atomic_mass_amu'
    | 'element_concept'
    | 'first_20_elements'
    | 'compare_atoms'
    | 'fix_symbols'
    | 'body_elements'
    | 'latin_symbols'
    | 'ket_hop_bai2_bai3';
  lesson?: 'bai_2' | 'bai_3' | 'ket_hop';
  textWithBlanks: string; // Contains placeholders like {{b1}}, {{b2}}
  blanks: BlankItem[];
  keywords: string[]; // Options for this question or to mix into keyword bank
  explanation: string;
  diagramUrl?: string;
  atomModelZ?: number; // to show atomic model if relevant
}

export interface ElementSymbolQuiz {
  id: string;
  level: 'thong_hieu';
  z: number;
  elementName: string;
  correctSymbol: string;
  options: string[];
  userAnswer?: string;
  explanation: string;
}

export interface SymbolCorrectionQuiz {
  id: string;
  level: 'van_dung';
  wrongOrGivenSymbol: string;
  elementName: string;
  isCorrect: boolean;
  correctSymbol: string;
  commonMistakeExplanation: string;
  userCorrection?: string;
  userChoice?: 'dung' | 'sai';
}

export interface CompareAtomQuiz {
  id: string;
  level: 'van_dung';
  title: string;
  atomA: { name: string; p: number; n: number; e: number };
  atomB: { name: string; p: number; n: number; e: number };
  question: string;
  options: string[];
  correctIndex: number;
  userAnswer?: number;
  explanation: string;
}

export interface AtomCardItem {
  id: string;
  label: string; // e.g. 'A (1, 0)'
  p: number;
  n: number;
  elementZ: number;
  elementName: string;
  elementSymbol: string;
}

export interface StudentInfo {
  fullName: string;
  studentId: string;
  className: string;
  schoolName: string;
  startedAt: string;
  submittedAt?: string;
}

export interface QuizSubmission {
  id: string;
  student: StudentInfo;
  score: number; // out of 10
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
  ranking: 'XUẤT SẮC' | 'GIỎI' | 'KHÁ' | 'ĐẠT' | 'CẦN CỐ GẮNG';
  breakdown: {
    nhanBiet: { correct: number; total: number };
    thongHieu: { correct: number; total: number };
    vanDung: { correct: number; total: number };
  };
  answersDetail: Record<string, any>;
  submittedAt?: string;
  syncedToGoogleSheet?: boolean;
  syncedAt?: string;
}

export interface GoogleSyncConfig {
  appsScriptUrl: string;
  spreadsheetUrl?: string;
  autoSync: boolean;
  lastSyncTime?: string;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}
