export interface Birthday {
  id: string;
  name: string;
  dateOfBirth: Date;
  note?: string;
  createdAt: Date;
}

export interface BirthdayWithAge extends Birthday {
  age: number;
  nextBirthday: Date;
  daysUntil: number;
}
