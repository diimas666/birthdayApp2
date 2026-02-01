export interface Birthday {
  id: string;
  name: string;
  dateOfBirth: Date;
  note?: string;
  phone?: string;
  photoUri?: string;
  tags?: string[];
  isImportant?: boolean;
  createdAt: Date;
}

export interface BirthdayWithAge extends Birthday {
  age: number;
  nextBirthday: Date;
  daysUntil: number;
}
