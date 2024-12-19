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
    type: string
    notes: string
    due_date_period: string
    due_date_value: number
    due_date_unit: string
    auto_reminders: boolean
}