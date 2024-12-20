export interface AlertInterface {
    alertTypeId: string
    alertDescription: string
    userDetailsId: string
    providerId: string
}

export interface UpdateAlertInterface {
    alertDescription: string
}

export interface AlertResponseInterface {
    data: AlertData[]
    total: number
    page: number
    limit: number
}

export interface AlertData {
    id: string
    alertDescription: string
    providerId: string
    createdAt: string
    updatedAt: string
    alertType: AlertType
}

export interface AlertType {
    id: string
    alertName: string
    notes: string
    createdAt: string
    updatedAt: string
}

export interface AlertTypeInterface {
  data: AlertType[];
  total: number;
  page: string;
  limit: string;
}