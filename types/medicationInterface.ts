export interface MedicationInterface {
  data: MedicationDataInterface[];
  count: number;
  page: string;
}

export interface MedicationDataInterface {
  id: string;
  desiredMedicationType: string;
  desiredMedicationName: string;
  dosage: string[];
  supply: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationInterface {
  desiredMedicationType: string;
  desiredMedicationName: string;
  dosage: string[];
  supply: string[];
}

export interface UserMedicationInterface {
  data: Medication[];
  total: number;
  page: string;
  limit: number;
}

export interface Medication {
  id: string;
  medicationType: string;
  medication: string;
  dosage: string;
  supply: string;
  desiredMedicationType: string;
  desiredMedication: string;
  desiredDosage: string;
  desiredSupply: string;
  sideEffectsFromPreviousMedication: string;
  dateOfFinalDoseOfCurrentMedication: string;
  weight4WeeksAgo: number;
  currentWeight: number;
  additionalText: string;
}

/**
 * * Provider Medication Interfaces (For Encounters module)
 */
export interface MedicationResultInterface {
  id: string;
  productName: string;
  tradeName: string;
  strength: string;
  route: string;
  doseForm: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationListResponseInterface {
  result: MedicationResultInterface[];
  total: number;
  page: string;
  limit: string;
}

export interface MedicationQueryParamsInterface {
  strength?: string;
  route?: string;
  doseForm?: string;
  limit?: number;
  page?: number;
}

export interface CreateMedicationPrescriptionInterface {
  directions: string;
  fromDate: string;
  toDate: string;
  status: "Active" | "Inactive";
  userDetailsId: string;
  providerId: string;
  medicationNameId: string;
}

export interface MedicationPrescriptionInterface {
	id: string;
	directions: string;
	fromDate: string;
	toDate: string;
	status: "Active" | "Inactive";
	providerId: string;
	createdAt: string;
	updatedAt: string;
	medicationName: MedicationResultInterface;
}

export interface MedicationPrescriptionResponseInterface {
	result: MedicationPrescriptionInterface[];
	total: number;
	page: string;
	limit: string;
}