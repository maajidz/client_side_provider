export interface VitalsInterface {
  id: string;
  dateTime: string;
  weightLbs: number;
  weightOzs: number;
  heightFeets: number;
  heightInches: number;
  BMI: number;
  startingWeight: number;
  goalWeight: number;
  providerId: string;
  userDetailsId: string;
}

export interface VitalsResponseInterface {
  data: VitalsInterface[];
  total: number;
}

export type CreateVitalType = Omit<VitalsInterface, "id">;

export type UpdateVitalType = CreateVitalType;
