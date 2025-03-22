import { ProviderDetails } from "./providerDetailsInterface"

export interface StickyNotesInterface {
    chartId: string
    title: string
    note: string
    providerId: string
    color: string
    isPinned: boolean
}

export interface UpdateStickyNotesInterface {
    title?: string
    note?: string
    color?: string
    isPinned?: boolean
}

export interface StickyNotesResponse {
    chartId: string
    title: string
    note: string
    provider: ProviderDetails
    id: string
    color: string
    isPinned: boolean
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
    title: string
    note: string
    color: string
    isPinned: boolean
    createdAt: string
    updatedAt: string
}
