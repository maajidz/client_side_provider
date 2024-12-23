export interface AllergenInterface {
    type: string
    serverity: string
    observedOn: string
    Allergen: string
    status: string
    reactions: Reaction[]
    userDetailsId: string
}

export interface UpdateAllergenInterface {
    type: string
    serverity: string
    observedOn: string
    Allergen: string
    status: string
    reactions: Reaction[]
}

export interface Reaction {
    name: string
    addtionalText: string
}