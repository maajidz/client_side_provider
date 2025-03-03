export interface RecallsInterface {
    type: string
    notes: string
    providerId: string
    due_date_period: string
    due_date_value: number
    due_date_unit: string
    auto_reminders: boolean
    userDetailsId: string
}

export interface UpdateRecallsInterface {
    type?: string
    notes?: string
    status?: string
    due_date_period?: string
    due_date_value?: number
    due_date_unit?: string
    auto_reminders?: boolean
}


export interface RecallsResponseInterface {
    data: RecallsData[]
    total: number
}

export interface RecallsData {
    id: string
    type: string
    notes: string
    providerId: string
    due_date_period: string
    due_date_value: number
    due_date_unit: string
    auto_reminders: boolean
    status: string;
    createdAt: string
    updatedAt: string
}

export interface RecallsEditData {
  id: string
  type: string
  notes: string
  providerId: string
  due_date_period: string
  due_date_value: number
  due_date_unit: string
  auto_reminders: boolean
}

