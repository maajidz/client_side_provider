import { PastMedicalHistoryInterface } from "@/services/pastMedicalHistoryInterface";
import { ActiveMedications, UserChart } from "./chartsInterface";
import { SocialHistoryInterface } from "./socialHistoryInterface";

export interface EncounterInterface {
  response?: EncounterResponse[];
  total: number;
  page: string;
  limit: string;
}

export interface EncounterResponse {
  id: string;
  visit_type: string;
  mode: string;
  date: string;
  isVerified: boolean;
  providerID: string;
  createdAt: string;
  updatedAt: string;
  chart?: UserChart;
  userDetails: UserDetails;
  progressTracker: ProgressTracker;
}

export interface UserDetails {
  userDetailsId: string
  firstName: string
  lastName: string
  patientId: string
  gender: string
  height: number
  heightType: string
  weight: string
  weightType: string
  dob: string
  phone_number: string
  medication_history: PastMedicalHistoryInterface[]
  history_of_present_illness: SocialHistoryInterface[]
  active_medications: ActiveMedications[]
}

export interface ProgressTracker {
  id: string;
  currentWeight: string;
  targetWeight: string;
  startDate: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
  bmiRecords: BmiRecord[];
}

export interface BmiRecord {
  id: string;
  date: string;
  currentBmi: number;
  goalBmi: number;
  createdAt: string;
  updatedAt: string;
}
