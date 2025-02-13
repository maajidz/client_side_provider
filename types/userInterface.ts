import { PastMedicalHistoryInterface } from "@/services/pastMedicalHistoryInterface";
import { AllergenResponseInterfae } from "./allergyInterface";
import { DiagnosesInterface, ImageOrdersData, TransferResponseData, UserChart } from "./chartsInterface";
import { VitalsInterface } from "./vitalsInterface";
import { Family } from "./familyHistoryInterface";
import { SocialHistoryInterface } from "./socialHistoryInterface";
import { Device } from "./implantedDevices";
import { EncounterResponse } from "./encounterInterface";
import { MedicationResultInterface } from "./medicationInterface";
import { RecallsData } from "./recallsInterface";
import { SupplementInterface } from "./supplementsInterface";
import { InjectionsInterface } from "./injectionsInterface";
import { UpdateProceduresInterface } from "./procedureInterface";

export interface CreateUser {
  user: CreateUserDataInterface;
  userDetails: CreateUserDetails;
}

export interface UserInfo {
  data: UserDataInterface;
}

export interface CreateUserDataInterface {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface UserDataInterface extends CreateUserDataInterface {
  id: string;
  userDetailsId: string;
  createdAt: string;
  updatedAt: string;
  userDetails: UserDetails;
}

export interface PatientDetailsInterface {
  userDetails: PatientDetails;
}

export interface PatientDetails {
  id: string;
  patientId: string;
  dob: string;
  height: number;
  heightType: string;
  weight: number;
  weightType: string;
  location: string;
  wallet: any;
  gender: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  allergies: AllergenResponseInterfae[];
  vitals: VitalsInterface[];
  encounter: EncounterResponse[];
}

export interface PatientDashboardInterface {
  id: string;
  patientId: string;
  dob: string;
  height: number;
  heightType: string;
  weight: number;
  weightType: string;
  location: string;
  wallet: any;
  encounter: Encounter;
  diagnoses: DiagnosesInterface
  medicationPrescriptions: MedicationPrescription;
  medicalHistory: PastMedicalHistoryInterface;
  familyHistory: Family;
  socialHistories: SocialHistoryInterface;
  documents: Document;
  vaccines: Vaccine;
  injections: Injection;
  labResults: LabResult;
  implantedDevices: Device[];
  imageResults: ImageResult[];
  procedures: UpdateProceduresInterface;
  injections_order: InjectionsInterface;
  supplements: SupplementInterface;
  transfers: TransferResponseData;
  recalls: RecallsData;
  imageOrders: ImageOrdersData;
}

export interface Encounter {
  id: string;
  date: string;
  chart?: UserChart;
}

export interface MedicationPrescription {
  id: string;
  directions: string;
  fromDate: string;
  toDate: string;
  status: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDetails {
  dob: string;
  height: number;
  heightType: string;
  weight: number;
  weightType: string;
  location: string;
  gender: string;
}

export interface UserDetails extends CreateUserDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponseInterface {
  data: UserData[];
  page: number;
  pageSize: number;
  total: number;
}

export interface UserData {
  id: string;
  patientId: string;
  dob: string;
  height: number;
  heightType: string;
  weight: number;
  weightType: string;
  location: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  userDetailsId?: string;
}

export interface UserAppointmentInterface {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhoneNumber: string;
  additionalText: string;
  additionalGuestInfo: AdditionalGuestInfo[];
  dateOfAppointment: string;
  timeOfAppointment: string;
  timeZone: string;
  status: string;
  userDetails: PatientDetails;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  providerName: string;
  specialization: string;
  endtimeOfAppointment: string;
  meetingLink: string;
  reason: string;
}

export interface AdditionalGuestInfo {
  name: string;
  phoneNumber: string;
  email: string;
}

export interface UserSubscription {
  total: number;
  subscriptions: Subscription[];
}

export interface Subscription {
  id: string;
  userDetailsID: string;
  startDate: string;
  endDate: string;
  amount: number;
  subscriptionType: string;
  status: string;
  cancelledDate: any;
}

export interface PaymentInterface {
  payments: Payment[];
  pagination: Pagination;
}

export interface Payment {
  id: string;
  userDetailsId: string;
  amount: string;
  currency: string;
  orderItem: string;
  additonalItemDetails: string;
  paymentIntentId: string;
  paymentMethodId: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: string;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export type PatientMedicationInterface = PatientMedication[];

export interface PatientMedication {
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
  paymentId?: string;
  status: string;
  userDetailsID: string;
  createdAt: string;
  updatedAt: string;
}

//Create Patient Interface

export interface UserFormInterface {
  data: UserForm[];
  status: string;
}

export interface UserForm {
  questionId: string;
  questionType: string;
  order: number;
  question: string;
  answerTexts: string[];
  answerIds: string[];
  additionalTexts: string;
  images: any[];
}

//Patient Care Team Interface
export interface PatientCareTeamInterface {
  patientProviderRelations: PatientProviderRelation[];
  primaryCarePhysician: PrimaryCarePhysician;
}

export interface PatientProviderRelation {
  id: string;
  userDetailsId: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrimaryCarePhysician {
  id: string;
  NameOfPhysician: string;
  PhoneNumberOfPhysician: string;
  FaxNumberOfPhysician: string;
  userDetailsID: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  document_type: string;
  notes: any;
  provderId?: string;
  date: string;
  file_for_review: boolean;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Vaccine {
  id: string;
  vaccine_name: string;
  providerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Injection {
  id: string;
  injection_name: string;
  providerId: string;
  dosage_unit: string;
  dosage_quantity: number;
  frequency: string;
  period_number: number;
  period_unit: string;
  parental_route: string;
  site: string;
  lot_number: number;
  expiration_date: string;
  administered_date: string;
  administered_time: string;
  note_to_nurse: string;
  comments: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabResult {
  id: string;
  reviewerId: string;
  dateTime: string;
  tags: string;
  files: string[];
  status: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageResult {
  id: string;
  reviewerId: string;
  dateTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  testResults: TestResult[];
}

export interface TestResult {
  id: string;
  interpretation: string;
  documents: any;
  createdAt: string;
  updatedAt: string;
}
