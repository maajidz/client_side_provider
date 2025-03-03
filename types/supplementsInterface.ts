export interface SupplementInterface {
  id: string;
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

export interface SupplementTypesInterface {
  id: string;
  supplement_name: string;
  description: string;
  createdAt: string
  updatedAt: string;
}

export interface SupplementTypesResponseInterface {
  data: SupplementTypesInterface[],
  total: number
}; 

export interface SupplementResponseInterface {
  data: SupplementInterface[];
  total: number;
  page: number;
  limit: number;
}

export type CreateSupplementType = Omit<SupplementInterface, "id">;

export type UpdateSupplementType = CreateSupplementType;
