import { ProviderDetails } from "./providerDetailsInterface"

export interface StickyNotesInterface {
    chartId: string
    note: string
    providerId: string
}

export interface UpdateStickyNotesInterface {
    note: string
}

export interface StickyNotesResponse {
    chartId: string
    note: string
    provider: ProviderDetails
    id: string
    createdAt: string
    updatedAt: string
}

export interface StickyNotesResponseInterface {
    data: StickyNotesData[]
    total: number
}

export interface StickyNotesData {
    id: string
    chartId: string
    note: string
    createdAt: string
    updatedAt: string
}
