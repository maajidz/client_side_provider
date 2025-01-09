export interface ProceduresInterface {
  type: string;
  name: string;
  fromDate: string;
  notes: string;
  userDetailsId: string;
}

export interface ProcedureResponse {
  data: ProcedureData[];
  total: number;
  page: string;
  limit: string;
}

export interface ProcedureData extends ProceduresInterface {
  id: string;
  createdAt: string;
  updatedAt: string;
}
