export interface CreateEncounterInterface {
    note: string
    mode: string
    isVerified: boolean
    userDetailsId: string
    providerId: string
    appointmentId: string
}

export interface LabsDataResponse {
    data: LabsData[]
    total: number
}

export interface LabsData {
    id: string
    name: string
    addtionalText: string
    createdAt: string
    updatedAt: string
}

export interface LabsRequestData {
    name: string,
    additionalText: string
}

export interface SOAPInterface {
    subjective: string
    objective: string
    assessment: string
    plan: string
    additionalText: string
    encounterId: string
}
