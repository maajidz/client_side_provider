export interface ProviderAppointmentsInterface {
  data: ProviderAppointmentsData[];
  total: number;
  page: number;
  limit: number;
}

export interface ProviderAppointmentsData {
  id: string;
  patientName: string;
  dateOfAppointment: string;
  timeOfAppointment: string;
  status: string;
  encounter: Encounter;
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
  additionalGuestInfo?: AdditionalGuestInfo[];
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
