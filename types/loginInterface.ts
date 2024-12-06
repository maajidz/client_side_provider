export interface LoginInterface {
    email: string,
    password: string
}

export interface LoginResponse {
    providerId: string
    token: string
    firstName: string
    lastName: string
    email: string
    providerDetails: ProviderDetails
    isVerified: boolean
}

export interface ProviderDetails {
    id: string
    professionalSummary: string
    gender: string
    roleName: string
    nip: string
    licenseNumber: string
    yearsOfExperience: number
    createdAt: string
    updatedAt: string
}