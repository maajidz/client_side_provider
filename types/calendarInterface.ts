export interface ProviderAvailability {
    availabilities: Availability[]
  }
  
  export interface Availability {
    date: string
    providerId: string
    slots: Slot[]
  }
  
  export interface Slot {
    startTime: string
    endTime: string
  }