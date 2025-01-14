export interface UserInfo {
  data: UserDataInterface
}

export interface UserDataInterface {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  userDetailsId: string
  createdAt: string
  updatedAt: string
  userDetails: UserDetails
}

export interface UserDetails {
  id: string
  dob: string
  height: number
  heightType: string
  weight: number
  weightType: string
  location: string
  gender: string
  createdAt: string
  updatedAt: string
}

export interface UserResponseInterface {
  data: UserData[]
  page: string
  pageSize: number
  total: number
}

export interface UserData {
  id: string
  dob: string
  height: number
  heightType: string
  weight: number
  weightType: string
  location: string
  gender: string
  createdAt: string
  updatedAt: string
  user: User
}

export interface User {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  userDetailsId?: string
}


export interface UserAppointmentInterface {
  id: string
  patientName: string
  patientEmail: string
  patientPhoneNumber: string
  additionalText: string
  additionalGuestInfo: AdditionalGuestInfo[]
  dateOfAppointment: string
  timeOfAppointment: string
  timeZone: string
  status: string
  userDetailsId: string
  providerId: string
  createdAt: string
  updatedAt: string
  providerName: string,
  specialization: string,
  endtimeOfAppointment: string,
  meetingLink: string
}

export interface AdditionalGuestInfo {
  name: string
  phoneNumber: string
  email: string
}

export interface UserSubscription {
  total: number
  subscriptions: Subscription[]
}

export interface Subscription {
  id: string
  userDetailsID: string
  startDate: string
  endDate: string
  amount: number
  subscriptionType: string
  status: string
  cancelledDate: any
}

export interface PaymentInterface {
  payments: Payment[]
  pagination: Pagination
}

export interface Payment {
  id: string
  userDetailsId: string
  amount: string
  currency: string
  orderItem: string
  additonalItemDetails: string
  paymentIntentId: string
  paymentMethodId: string
  type: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: string
  limit: number
  totalRecords: number
  totalPages: number
}

export type PatientMedicationInterface = PatientMedication[]

export interface PatientMedication {
  id: string
  medicationType: string
  medication: string
  dosage: string
  supply: string
  desiredMedicationType: string
  desiredMedication: string
  desiredDosage: string
  desiredSupply: string
  sideEffectsFromPreviousMedication: string
  dateOfFinalDoseOfCurrentMedication: string
  weight4WeeksAgo: number
  currentWeight: number
  additionalText: string
  paymentId?: string
  status: string
  userDetailsID: string
  createdAt: string
  updatedAt: string
}

export interface UserFormInterface {
  data: UserForm[]
  status: string
}

export interface UserForm {
  questionId: string
  questionType: string
  order: number
  question: string
  answerTexts: string[]
  answerIds: string[]
  additionalTexts: string
  images: any[]
}


