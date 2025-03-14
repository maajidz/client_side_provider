import { UserChart } from "./chartsInterface";
import { UserDetails } from "./userInterface";

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
  id: string
  date: string
  currentBmi: number
  goalBmi: number
  createdAt: string
  updatedAt: string
}
