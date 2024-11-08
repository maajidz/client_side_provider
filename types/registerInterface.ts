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