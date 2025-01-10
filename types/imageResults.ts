export interface UploadImageResultInterface {
  images: File[];
  userDetailsId: string;
}

export type UploadImageRequestResponse = string[];

export interface CreateImageResultInterface {
  userDetailsId: string;
  reviewerId: string;
  testResults: TestResult[];
}

export interface TestResult {
  imageTestId: string;
  interpretation: string;
  documents: string[];
}

export interface ImageResultResponseInterface {
  data: ImageResultDataResponse[]
  total: number
}

export interface ImageResultDataResponse {
  id: string
  reviewerId: string
  dateTime: string
  createdAt: string
  updatedAt: string
  testResults: TestResultResponse[]
}

export interface TestResultResponse {
  id: string
  interpretation: string
  documents?: string[]
  createdAt: string
  updatedAt: string
  imageTest: ImageTestResponse
}

export interface ImageTestResponse {
  id: string
  name: string
  additionalText: any
  createdAt: string
  updatedAt: string
  imageType: ImageTypeResponse
}

export interface ImageTypeResponse {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

