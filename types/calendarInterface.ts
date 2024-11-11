export interface ProviderAvailabilityRequestInterface {
  availabilities: AvailabilityRequest[]
}

export interface AvailabilityRequest {
  date: string
  providerId: string
  slots: RequestedSlots[]
}

export interface RequestedSlots {
  startTime: string
  endTime: string
}

export interface ProviderAvailability {
  data: AvailabilityData[]
  total: number
  page: number
  limit: number
}

export interface AvailabilityData {
  id: string
  date: string
  isAvailable: boolean
  notes: string
  slots: Slot[]
  createdAt: string
  updatedAt: string
}

export interface Slot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface UpdateAvailabiltyInterface {
  date: string
  isAvailable: boolean
  notes: string
  slots: RequestedSlots[]
}

export interface DeleteAvailabiltyInterface {
  message: string
}