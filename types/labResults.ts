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
