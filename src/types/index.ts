export interface Exercise {
  id: string;
  name: string;
  defaultSets: number;
  defaultReps: number;
  defaultHoldTime: number;
}

export interface Category {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Combo {
  id: string;
  name: string;
  exercises: Exercise[];
  frequency: number;
  breakInterval: number;
  selectedDays: string[];
  therapistNotes: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AppData {
  categories: Category[];
  savedCombos: Combo[];
}
