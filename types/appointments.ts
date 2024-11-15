export interface ProviderAppointmentsInterface {
    data: ProviderAppointmentsData[]
    total: number
    page: number
    limit: number
}

export interface ProviderAppointmentsData {
    id: string
    patientName: string
    dateOfAppointment: string
    timeOfAppointment: string
    status: string
    encounter: Encounter
}

export interface Encounter {
    id: string
    note: string
    mode: string
}