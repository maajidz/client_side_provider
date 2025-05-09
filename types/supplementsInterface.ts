export interface SupplementInterface {
  supplementId: string;
  supplement: string;
  manufacturer: string;
  fromDate: string;
  toDate: string;
  status: "Active" | "Inactive";
  dosage: string;
  unit: string;
  frequency: string;
  intake_type: string;
  comments: string;
  userDetailsId: string;
}

export interface SupplementInterfaceResponse {
  id: string;
  manufacturer: string;
  fromDate: string;
  toDate: string;
  status: "Active" | "Inactive";
  dosage: string;
  unit: string;
  frequency: string;
  intake_type: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  type: SupplementTypesInterface;
}

export interface SupplementTypesInterface {
  id: string;
  supplement_name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplementTypesResponseInterface {
  data: SupplementTypesInterface[];
  total: number;
}

export interface SupplementResponseInterface {
  data: SupplementInterfaceResponse[];
  total: number;
  page: number;
  limit: number;
}

export type CreateSupplementType = SupplementInterface;

export type UpdateSupplementType = CreateSupplementType;
