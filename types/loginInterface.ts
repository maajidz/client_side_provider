export interface LoginInterface {
    email: string,
    password: string
}

export interface LoginResponse {
    providerId: string
    token: string
}