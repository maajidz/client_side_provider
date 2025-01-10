export interface PastMedicalHistoryInterface {
  id: string;
  notes: string;
  glp_refill_note_practice: string;
  userDetailsId: string;
}

export interface PastMedicalHistoryResponseInterface {
  items: PastMedicalHistoryInterface[];
  total: number;
}

export type CreatePastMedicalHistoryType = Omit<
  PastMedicalHistoryInterface,
  "id"
>;

export type UpdatePastMedicalHistoryType = CreatePastMedicalHistoryType;
