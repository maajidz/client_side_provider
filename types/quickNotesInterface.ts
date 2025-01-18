export interface ProviderDetail {
  id: string;
  professionalSummary: string;
  gender: string;
  roleName: string;
  nip: string;
  licenseNumber: string;
  yearsOfExperience: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuickNotesInterface {
  id: string;
  note: string;
  userDetailsId: string;
  createdAt: string;
  updatedAt: string;
  providerDetails: ProviderDetail;
}

export interface QuickNotesResponseInterface {
  data: QuickNotesInterface[];
  total: number;
}
export interface CreateQuickNoteInterface {
  note: string;
  userDetailsId: string;
  providerId: string;
}

export type UpdateQuickNotesType = Pick<CreateQuickNoteInterface, "note">;
