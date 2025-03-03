import { ExistingProviderDetails } from "./registerInterface";

export interface ProviderDetails {
  professionalSummary: string;
  gender: string;
  roleName: string;
  nip: string;
  licenseNumber: string;
  yearsOfExperience: number;
  providerAuthId: string;
  address: string;
}

export interface UpdateProviderDetails {
  professionalSummary: string;
  gender: string;
  roleName: string;
  nip: string;
  licenseNumber: string;
  yearsOfExperience: number;
  address: string
}

export interface FetchProviderListInterface {
  data: FetchProviderList[];
  total: number;
}

export interface FetchProviderList {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  providerDetails?: ExistingProviderDetails;
}
