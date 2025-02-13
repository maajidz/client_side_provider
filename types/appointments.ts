import { UserDetails } from "./chartsInterface";

export interface ProviderAppointmentsInterface {
  data: ProviderAppointmentsData[];
  total: number;
  page: number;
  limit: number;
}

export interface ProviderAppointmentsData {
  id: string
  patientName: string
  patientEmail: string
  patientPhoneNumber: string
  additionalText: string
  additionalGuestInfo?: AdditionalGuestInfo[]
  dateOfAppointment: string
  timeOfAppointment: string
  endtimeOfAppointment?: string
  timeZone: string
  status: string
  providerId: string
  meetingLink: string
  reason: string
  createdAt: string
  updatedAt: string
  encounter: Encounter
  userDetails: UserDetails
}

export interface Encounter {
  id: string;
  note: string;
  mode: string;
}

export interface ProviderAppointmentsStatus {
  status: string;
}

export interface CreateUserAppointmentsInterface {
  patientName: string;
  patientEmail: string;
  patientPhoneNumber: string;
  additionalText: string;
  reason?: string;
  dateOfAppointment: string;
  timeOfAppointment: string;
  timeZone: string;
  status: string;
  providerId: string;
  userDetailsId: string;
}

export interface AdditionalGuestInfo {
  name: string;
  phoneNumber: string;
  email: string;
}
