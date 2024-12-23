import { UserDetails } from "./chartsInterface"

export interface FamilyHistoryInterface {
    relationship: string
    deceased: boolean
    age: number
    comments: string
    activeProblems: ActiveProblem[]
    userDetailsId: string
}

export interface ActiveProblem {
    name: string
    addtionaltext: string
}

export interface FamilyHistoryResponseInterface {
    id: string
    relationship: string
    deceased: boolean
    age: number
    comments: string
    createdAt: string
    updatedAt: string
    activeProblems: ActiveProblemResponse[]
    userDetails: UserDetails
}

export interface ActiveProblemResponse {
    name: string
    addtionaltext: string
    id: string
    createdAt: string
    updatedAt: string
    family: Family
}


export interface Family {
    id: string
    relationship: string
    deceased: boolean
    age: number
    comments: string
    createdAt: string
    updatedAt: string
}

export interface EditFamilyHistoryInterface {
    relationship: string
    deceased: boolean
    age: number
    comments: string
    activeProblems: ActiveProblem[]
    id: string
}

export interface UpdateFamilyHistoryInterface  {
    relationship: string
    deceased: boolean
    age: number
    comments: string
    activeProblems: ActiveProblem[]
}
