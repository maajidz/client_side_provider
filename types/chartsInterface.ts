export interface CreateEncounterInterface {
    note: string
    mode: string
    isVerified: boolean
    userDetailsId: string
    providerId: string
    appointmentId: string
}

export interface LabsDataResponse {
    data: LabsData[],
    total: number
}

export interface LabsData{
    id: string,
    name: string
}