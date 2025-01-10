import { UserChart } from "./chartsInterface";
import { UserDetails } from "./userInterface";

export interface EncounterInterface {
  response?: EncounterResponse[];
  total: number;
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
}
