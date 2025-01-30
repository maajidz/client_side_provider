export interface PastMedicalHistoryInterface {
  id: string;
  notes: string;
  glp_refill_note_practice: string;
  createdAt: string;
  updatedAt: string;
}

export interface PastMedicalHistoryResponseInterface {
  items: PastMedicalHistoryInterface[];
  total: number;
}

export interface CreatePastMedicalHistoryType {
  notes: string;
  glp_refill_note_practice: string;
  userDetailsId: string;
}

export type UpdatePastMedicalHistoryType = CreatePastMedicalHistoryType;


