export interface MedicationInterface {
    data: MedicationDataInterface[],
    count: number,
    page: string
}

export interface MedicationDataInterface {
    id: string
    desiredMedicationType: string
    desiredMedicationName: string
    dosage: string[]
    supply: string[]
    createdAt: string
    updatedAt: string
}

export interface CreateMedicationInterface {
    desiredMedicationType: string,
    desiredMedicationName: string,
    dosage: string[]
    supply: string[]
}

export interface UserMedicationInterface {
    data: Medication[]
    total: number
    page: string
    limit: number
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


  