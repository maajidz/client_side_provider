export interface ProceduresInterface {
  type: string;
  name: string;
  fromDate: string;
  toDate: string;
  notes: string;
  userDetailsId: string;
}

export interface UpdateProceduresInterface {
  type: string;
  name: string;
  fromDate: string;
  toDate: string;
  notes: string;
  userDetailsId: string;
  id: string;
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
