import { Dosage } from "./chartsInterface";

export interface PrescriptionDataInterface {
  id: string;
  drug_name: string;
  dispense_as_written: boolean;
  primary_diagnosis: string;
  secondary_diagnosis: string;
  directions: string;
  dispense_quantity: number;
  dispense_unit: string;
  prior_auth: string;
  prior_auth_decision: string;
  internal_comments: string;
  days_of_supply: number;
  additional_refills: number;
  Note_to_Pharmacy: string;
  earliest_fill_date: string;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt: string;
  dosages: Dosage[];
  fromDate: string;
  toDate: string;
  userDetails: {
    userID: string;
    userName: string;
  };
  provideName: string;
  providerId: null;
}

export interface PrescriptionResponseInterface {
  message: string;
  data: PrescriptionDataInterface[];
  totalCount: number;
  page: string;
  limit: string;
}

export interface UpdatePrescriptionInterface {
  dispense_as_written: boolean;
  Note_to_Pharmacy?: string;
  fromDate: string;
  toDate: string;
  internalComments?: string;
  status: "pending" | "completed";
}
