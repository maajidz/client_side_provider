import { Dosage } from "./chartsInterface";

export interface PrescriptionDataInterface {
	id: string;
	drug_name: string;
	dispense_as_written: boolean;
	primary_diagnosis: string;
	secondary_diagnosis: string;
	directions: string;
	dispense_quantity: number;
	dispense_unit: string;
	prior_auth: string;
	prior_auth_decision: string;
	internal_comments: string;
	days_of_supply: number;
	additional_refills: number;
	note_to_Pharmacy: string;
	earliest_fill_date: string;
	createdAt: string;
	updatedAt: string;
	dosages: Dosage[];
}

export interface PrescriptionResponseInterface {
	message: string;
	data: PrescriptionDataInterface[];
	totalCount: number;
	page: string;
	limit: string;
}