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
