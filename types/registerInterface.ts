export interface RegisterInterface {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
}

export interface RegisterResponseInterface {
    message: string,
    providerId: string
}

export interface ProviderExistsDetails {
    id: string
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
    token: any
    tokenCreatedAt: any
    isVerified: boolean
    createdAt: string
    updatedAt: string
    providerDetails: ExistingProviderDetails
}

export interface ExistingProviderDetails {
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

export interface ChangePasswordInterface {
  oldPassword: string;
  newPassword: string;
}