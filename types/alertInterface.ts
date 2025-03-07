export interface AlertInterface {
  alertTypeId: string;
  alertDescription: string;
  userDetailsId: string;
  providerId: string;
}

export interface UpdateAlertInterface {
  alertDescription: string;
}

export interface AlertResponseInterface {
  data: AlertDataInterface[];
  total: number;
  page: number;
  limit: number;
}

export interface AlertDataInterface {
  alert: AlertData;
  providerPatientDetails: ProviderPatientDetails;
}

export interface AlertData {
  id: string;
  alertDescription: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  alertType: AlertType;
}

export interface AlertType {
  id: string;
  alertName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertTypeInterface {
  data: AlertType[];
  total: number;
  page: string;
  limit: string;
}

export interface ProviderPatientDetails {
  userDetails: AlertUserDetails;
  provider: Provider;
}

export interface AlertUserDetails {
  id: string;
  patientId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
}

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  providerDetails: ProviderUniqueDetails;
}

export interface ProviderUniqueDetails {
  id: string;
  providerUniqueId: string;
}
