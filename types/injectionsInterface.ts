export interface InjectionsInterface {
  id: string;
  injection_name: string;
  dosage_unit: string;
  dosage_quantity: number;
  frequency: string;
  period_number: number;
  period_unit: string;
  parental_route: string;
  note_to_nurse?: string;
  comments?: string;
  status: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  createdAt: string;
  userDetails: {
    id: string;
    gender: "Male" | "Female" | "Other";
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface InjectionsResponseInterface {
  data: InjectionsInterface[];
  total: number;
  page: number;
  limit: number;
}

export type CreateInjectionType = Omit<
  InjectionsInterface,
  "id" | "createdAt" | "userDetails" | "providerName" | "providerEmail"
> & {
  userDetailsId: string;
};

export type InjectionsSearchParamsType = Partial<{
  providerId: string;
  userDetailsId: string;
  status: string;
  page: number;
  limit: number;
}>;

/**
 * * Vaccines Interfaces (& Types)
 */
export interface VaccinesInterface {
  id: string;
  vaccine_name: string;
  status: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  createdAt: string;
  userDetails: {
    id: string;
    gender: "Male" | "Female" | "Other";
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface VaccinesResponseInterface {
  data: VaccinesInterface[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateVaccineInterface {
  vaccine_name: string;
  providerId: string;
  userDetailsId: string;
}

export type VaccinesSearchParamsType = InjectionsSearchParamsType;
