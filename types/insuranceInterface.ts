export interface InsuranceResponse {
  id: string;
  type: string;
  companyName: string;
  groupNameOrNumber: string;
  subscriberNumber: string;
  idNumber: string;
  images: File[];
  status: string;
  userDetailsID: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInsuranceInterface {
  type: string;
  companyName: string;
  groupNameOrNumber: string;
  subscriberNumber: string;
  idNumber: string;
  status: string;
  userDetailsID: string;
}

export type IsInsuredType =  {
  isInsured: string;
}

export type InsuranceType = {
  type: string;
}