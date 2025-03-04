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
}

export interface ProceduresTypesResponseInterface {
  data: ProceduresTypesInterface[]
  total: number
}

export interface ProceduresTypesInterface {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}


export interface ProcedureResponse {
  data: ProcedureData[];
  total: number;
  page: string;
  limit: string;
}

export interface ProcedureData extends UpdateProceduresInterface {
  createdAt: string;
  updatedAt: string;
}
