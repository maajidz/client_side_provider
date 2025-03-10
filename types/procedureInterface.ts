export interface ProceduresInterface {
  type: string;
  nameId: string;
  fromDate: string;
  toDate: string;
  notes: string;
  userDetailsId: string;
}

export interface UpdateProceduresInterface {
  type: string;
  nameId: string;
  fromDate: string;
  toDate: string;
  notes: string;
  userDetailsId: string;
  id: string;
  nameType: NameType;
}

export interface ProceduresTypesResponseInterface {
  data: ProceduresTypesInterface[];
  total: number;
}

export interface ProceduresTypesInterface {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureResponse {
  data: ProcedureData[];
  total: number;
  page: string;
  limit: string;
}

export interface ProcedureData {
  id: string;
  type: string;
  nameId: string;
  fromDate: string;
  toDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  nameType: NameType;
}

export interface NameType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
