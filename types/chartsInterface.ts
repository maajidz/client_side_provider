export interface CreateEncounterInterface {
    visit_type: string
    mode: string
    isVerified: boolean
    userDetailsId: string
    providerId: string
    appointmentId?: string
    date: string
}

export interface CreateEncounterResponseInterface {
    visit_type: string
    mode: string
    date: string
    isVerified: boolean
    providerID: string
    userDetails: UserDetails
    id: string
    createdAt: string
    updatedAt: string
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
    objective?: string
    assessment?: string
    plan?: string
    additionalText?: string
    encounterId: string
}

export interface UserEncounterInterface {
    data: UserEncounterData[]
    total: number
}

export interface UserEncounterData {
    id: string
    visit_type: string
    mode: string
    date: string
    isVerified: boolean
    providerID: string
    createdAt: string
    updatedAt: string
    chart: UserChart | null
    userDetails: UserDetails
}

export interface UserChart {
    id: string
    subjective: string
    objective: string
    assessment: string
    plan: string
    additionalText: string
    createdAt: string
    updatedAt: string
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
