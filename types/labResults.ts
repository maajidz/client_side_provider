export interface CreateLabResults {
  userDetailsId: string;
  reviewerId: string;
  dateTime: string;
  labId: string;
  testIds: string[];
  testResults: TestResult[];
  tags: string;
}

export interface TestResult {
  name: string;
  result: string;
  unit: string;
  min: number;
  max: number;
  interpretation: string;
  comment: string;
  groupComment: string;
}

export interface LabResultsInterface {
  total: number
  page: string
  limit: string
  results: Result[]
}

export interface Result {
  id: string
  reviewerId: string
  dateTime: string
  tags: string
  file: any
  createdAt: string
  updatedAt: string
}
