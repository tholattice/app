export interface UserProps {
    id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: Date;
    role: "owner" | "member" | "admin" | "masseuse" | "client";
  }

export interface AppointmentFormProps {
  soloOrCouples: string;
  massageType: string;
  fourHand: boolean;
  duration: number;
  pressure: string;
  addons: string[];
  preferredTimes: string[];
  masseusePreferences: {
    gender: string;
    preference: string;
  };
  selectedMasseuses: string[];
  selectedDateTime: Date;
}

export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}