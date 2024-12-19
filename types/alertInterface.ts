export interface AlertInterface {
    alertTypeId: string
    alertDescription: string
    userDetailsId: string
    providerId: string
}

export interface UpdateAlertInterface {
    alertDescription: string
}
