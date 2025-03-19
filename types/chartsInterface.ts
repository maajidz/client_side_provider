import { Provider } from "./alertInterface";
import { ProviderDetails } from "./loginInterface";
import { User, UserData } from "./userInterface";

export interface CreateEncounterInterface {
  visit_type: string;
  mode: string;
  isVerified: boolean;
  userDetailsId: string;
  providerId: string;
  appointmentId?: string;
  date: string;
}

export interface CreateEncounterResponseInterface {
  visit_type: string;
  mode: string;
  date: string;
  isVerified: boolean;
  providerID: string;
  userDetails: UserDetails;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetails {
  id: string;
  dob: string;
  patientId: string;
  height: number;
  heightType: string;
  weight: number;
  weightType: string;
  location: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabsDataResponse {
  data: LabsData[];
  total: number;
}

export interface LabsData {
  id: string;
  name: string;
  addtionalText: string;
  createdAt: string;
  updatedAt: string;
  tests: Test[];
}

export interface LabsRequestData {
  name: string;
  additionalText: string;
}

export interface SOAPInterface {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  additionalText?: string;
  encounterId: string;
}

export interface UpdateSOAPInterface {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  additionalText?: string;
}

export interface UserEncounterInterface {
  response: UserEncounterData[];
  total: number;
  page: string;
  limit: string;
}

export interface UserEncounterData {
  chart: UserChart;
  userDetails: ChartUserDetails;
  id?: string;
  visit_type?: string;
  mode?: string;
  date?: string;
  isVerified?: boolean;
  providerID?: string;
  createdAt?: string;
  updatedAt?: string;
  progressTracker?: ProgressTracker;
}

export interface ChartUserDetails {
  userDetailsId: string;
  firstName: string;
  lastName: string;
  patientId: string;
  medication_history?: MedicationHistory[];
  history_of_present_illness?: HistoryOfPresentIllness[];
  active_medications: ActiveMedications[];
}

export interface ProgressTracker {
  id: string;
  currentWeight: string;
  targetWeight: string;
  startDate: string;
  targetDate: string;
  bmiRecords: BmiRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicationHistory {
  id: string;
  notes: string;
  glp_refill_note_practice: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryOfPresentIllness {
  id: string;
  content: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveMedications {
  id: string;
  directions: string;
  fromDate: string;
  toDate: string;
  status: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  medicationName: MedicationName;
}

export interface MedicationName {
  id: string;
  productName: string;
  tradeName: string;
  strength: string;
  route: string;
  doseForm: string;
  createdAt: string;
  updatedAt: string;
}

export interface BmiRecord {
  id: string;
  date: string;
  currentBmi: number;
  goalBmi: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserChart {
  id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  additionalText: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetails {
  createdAt: string;
  updatedAt: string;
  id: string;
  dob: string;
  height: number;
  heightType: string;
  weight: number;
  weightType: string;
  location: string;
  gender: string;
}

export interface PatientPhysicalStats {
  height: number;
  weight: number;
}

export interface CreateDiagnosesRequestBody {
  userDetailsId: string;
  providerId: string;
  diagnoses: {
    diagnosis_Id: string;
    chartId: string;
    notes?: string;
    status?: "active" | "inactive";
    fromDate?: string;
    toDate?: string;
  }[];
}

export interface UpdateDiagnosesRequestBody {
  id?: string;
  ICD_Code?: string;
  notes?: string;
  status?: "active" | "inactive";
  fromDate?: string;
  toDate?: string;
}

export interface PastDiagnosesInterface {
  id: string;
  diagnosis_name: string;
  ICD_Code: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  type: DiagnosesTypeData;
  chart: DiagnosesChart;
}

export interface ChartInterface {
  id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  additionalText?: string;
  createdAt: string;
  updatedAt: string;
}

// * For Diagnoses in patient details
export interface DiagnosesInterface {
  id: string;
  diagnosis_Id: string;
  notes: string;
  providerId: string;
  status: string;
  fromDate?: string;
  toDate?: string;
  createdAt: string;
  updatedAt: string;
  chart: ChartInterface;
  type: DiagnosisType;
  providerUniqueId: string;
}
export interface DiagnosisType {
  id: string;
  diagnosis_name: string;
  ICD_Code: string;
  description: string;
}

export interface DiagnosesResponseInterface {
  diagnoses: DiagnosesInterface[];
  totalCount: number;
}

export interface DiagnosesChart {
  id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  additionalText: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosesTypeDataInterface {
  data: DiagnosesTypeData[];
  total: number;
  page: string;
  limit: string;
}

export interface DiagnosesTypeData {
  id: string;
  diagnosis_name: string;
  ICD_Code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabOrdersInterface {
  userDetailsId: string;
  orderedBy: string;
  date: string;
  labs: string[];
  tests: string[];
  isSigned: boolean;
}

export interface ImageOrdersInterface {
  userDetailsId: string;
  ordered_date: string;
  providerId: string;
  imageTypeId: string;
  imageTestIds: string[];
  note_to_patients: string;
  intra_office_notes: string;
}

/**
 * * ADD IMAGE RESULT INTERFACE
 */

export interface ImageResultInterface {
  reviewerId: string;
  userDetailsId: string;
  testResults: { document: string; interpretation: string }[];
}

export interface CreateTestsRequestBody {
  name: string;
  labId: string;
}

export interface TestResponse {
  name: string;
  lab: Lab;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lab {
  id: string;
  name: string;
  addtionalText: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFollowUp {
  type: string;
  notes: string;
  sectionDateType: string;
  sectionDateNumber: number;
  sectionDateUnit: string;
  chartId: string;
  reminders: string[];
}

export interface UpdateFollowUp {
  type: string;
  notes: string;
  sectionDateType: string;
  sectionDateNumber: number;
  sectionDateUnit: string;
  reminders: string[];
}

export interface FollowUpInterface {
  id: string;
  type: string;
  notes: string;
  sectionDateType: string;
  sectionDateNumber: number;
  sectionDateUnit: string;
  reminders: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TestsResponseInterface {
  data: TestsResponseData[];
  total: number;
}

export interface TestsResponseData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  lab: Lab;
}

export interface Lab {
  id: string;
  name: string;
  addtionalText: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImagesTestsResponseInterface {
  data: ImagesTestData[];
  total: number;
}

export interface ImagesTestData {
  id: string;
  name: string;
  additionalText: string;
  createdAt: string;
  updatedAt: string;
  imageType: ImageType;
}

export interface ImageType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImagesResponseInterface {
  data: ImagesResponse[];
  total: number;
}

export interface ImagesResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabOrdersDataInterface {
  data: LabOrdersData[];
  total: number;
}

export interface LabOrdersData {
  id: string;
  orderedBy: string;
  date: string;
  isSigned: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  labs: Lab[];
  tests: Test[];
  userDetails: LabUserDetails;
  providerDetails: ProviderDetails;
}

export interface LabUserDetails {
  id: string;
  patientId: string;
  gender: string;
}

export interface Test {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestInterface {
  id: string;
  name: string;
}

export interface CreatePrescriptionInterface {
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
  Note_to_Pharmacy: string;
  earliest_fill_date: string;
  dosages: Dosage[];
  chartId: string;
}

export interface Dosage {
  id?: string;
  dosage_quantity: number;
  dosage_unit: string;
  route: string;
  frequency: string;
  when: string;
  duration_quantity: string;
  duration_unit: string;
}

export interface FetchPrescription {
  message: string;
  prescriptions: Prescription[];
}

export interface Prescription {
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
  Note_to_Pharmacy: string;
  earliest_fill_date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImagesOrdersDataInterface {
  data: LabOrdersData[];
  total: number;
}

export interface CreateTransferInterface {
  referringToProviderID: string;
  referringFromProviderID: string;
  referralType: string;
  referralReason: string;
  priority: string;
  notes: string;
  relatedEncounterId: string;
  diagnoses: string[];
  insuranceId: string;
  attachments: string[];
  userDetailsID: string;
}

export interface TransferResponseData {
  id: string;
  referringToProviderID: string;
  referringFromProviderID: string;
  referralType: string;
  requestStatus: string;
  responseStatus: string;
  referralReason: string;
  priority: string;
  notes: string;
  insurance: any;
  attachments: any[];
  createdAt: string;
  updatedAt: string;
  relatedEncounter: RelatedEncounter;
  userDetails: UserData;
  referringFromProvider: ReferringProvider;
  referringToProvider: ReferringProvider;
  diagnoses: PastDiagnosesInterface[];
}

export interface ReferringProvider {
  id: string;
  providerUniqueId: string;
  address: string;
}

export interface RelatedEncounter {
  id: string;
  visit_type: string;
  mode: string;
  date: string;
  isVerified: boolean;
  providerID: string;
  createdAt: string;
  updatedAt: string;
  chart: UserChart;
}

export interface ImageOrdersResponseInterface {
  data: ImageOrdersData[];
  total: number;
  page: string;
  limit: string;
}

export interface ImageOrdersData {
  id: string;
  ordered_date: string;
  providerId: string;
  note_to_patients: string;
  intra_office_notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  imageType: ImageType;
  imageTests: ImagesTestData[];
  userDetails: {
    id: string;
    patientId: any;
    user: User;
  };
  providerDetails: Provider;
}

export interface ImageType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * * Historical Vaccines Interfaces (& Types)
 */
export interface HistoricalVaccineInterface {
  id: string;
  vaccine_name: string;
  date: string;
  status: string;
  in_series?: string;
  source?: string;
  notes?: string;
  providerId: string;
  userDetailsId: string;
}

export interface HistoricalVaccineResponseInterface {
  data: HistoricalVaccineInterface[];
  total: number;
}

export type CreateHistoricalVaccineType = Omit<
  HistoricalVaccineInterface,
  "id" | "status"
>;

export type UpdateHistoricalVaccineType = CreateHistoricalVaccineType;
