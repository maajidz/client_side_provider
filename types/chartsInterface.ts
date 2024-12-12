export interface CreateEncounterInterface {
    visit_type: string
    mode: string
    isVerified: boolean
    userDetailsId: string
    providerId: string
    appointmentId?: string
    date: string
}

export interface CreateEncounterResponseInterface {
    visit_type: string
    mode: string
    date: string
    isVerified: boolean
    providerID: string
    userDetails: UserDetails
    id: string
    createdAt: string
    updatedAt: string
}

export interface UserDetails {
    id: string
    dob: string
    height: number
    heightType: string
    weight: number
    weightType: string
    location: string
    gender: string
    createdAt: string
    updatedAt: string
}

export interface LabsDataResponse {
    data: LabsData[]
    total: number
}

export interface LabsData {
    id: string
    name: string
    addtionalText: string
    createdAt: string
    updatedAt: string
}

export interface LabsRequestData {
    name: string,
    additionalText: string
}

export interface SOAPInterface {
    subjective: string
    objective?: string
    assessment?: string
    plan?: string
    additionalText?: string
    encounterId: string
}

export interface UpdateSOAPInterface {
    subjective?: string
    objective?: string
    assessment?: string
    plan?: string
    additionalText?: string
}


export interface UserEncounterInterface {
    response: UserEncounterData[]
    total: number
}

export interface UserEncounterData {
    id: string
    visit_type: string
    mode: string
    date: string
    isVerified: boolean
    providerID: string
    createdAt: string
    updatedAt: string
    chart: UserChart | null
    userDetails: UserDetails
}

export interface UserChart {
    id: string
    subjective: string
    objective: string
    assessment: string
    plan: string
    additionalText: string
    createdAt: string
    updatedAt: string
}

export interface UserDetails {
    createdAt: string
    updatedAt: string
    id: string
    dob: string
    height: number
    heightType: string
    weight: number
    weightType: string
    location: string
    gender: string
}

export interface PatientPhysicalStats {
    height: number,
    weight: number
}

export interface CreateDiagnosesRequestBody {
    diagnosis_name: string
    ICD_Code: string
    notes: string
    chartId: string
}

export interface UpdateDiagnosesRequestBody {
    diagnosis_name: string
    ICD_Code: string
    notes: string
}

export interface PastDiagnosesInterface {
    id: string
    diagnosis_name: string
    ICD_Code: string
    notes: string
    createdAt: string
    updatedAt: string
    chart: DiagnosesChart
}

export interface DiagnosesChart {
    id: string
    subjective: string
    objective: string
    assessment: string
    plan: string
    additionalText: any
    createdAt: string
    updatedAt: string
}

export interface LabOrdersInterface {
    userDetailsId: string
    orderedBy: string
    date: string
    labs: string[]
    tests: string[]
    isSigned: boolean
}

export interface CreateTestsRequestBody {
    name: string
    labId: string
}

export interface TestResponse {
    name: string
    lab: Lab
    id: string
    createdAt: string
    updatedAt: string
}

export interface Lab {
    id: string
    name: string
    addtionalText: string
    createdAt: string
    updatedAt: string
}

export interface CreateFollowUp {
    type: string
    notes: string
    sectionDateType: string
    sectionDateNumber: number
    sectionDateUnit: string
    chartId: string
    reminders: string[]
}

export interface UpdateFollowUp {
    type: string
    notes: string
    sectionDateType: string
    sectionDateNumber: number
    sectionDateUnit: string
    reminders: string[]
}


export interface FollowUpInterface {
    id: string
    type: string
    notes: string
    sectionDateType: string
    sectionDateNumber: number
    sectionDateUnit: string
    reminders: string[]
    createdAt: string
    updatedAt: string
}

export interface TestsResponseInterface {
    data: TestsResponseData[]
    total: number
}

export interface TestsResponseData {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    lab: Lab
}

export interface Lab {
    id: string
    name: string
    addtionalText: string
    createdAt: string
    updatedAt: string
}

export interface ImagesTestsResponseInterface {
    data: ImagesTestData[]
    total: number
}

export interface ImagesTestData {
    id: string
    name: string
    additionalText: any
    createdAt: string
    updatedAt: string
    imageType: ImageType
}

export interface ImageType {
    id: string
    name: string
    createdAt: string
    updatedAt: string
}

export interface ImagesResponseInterface {
    data: ImagesResponse[]
    total: number
  }
  
  export interface ImagesResponse {
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }
  

