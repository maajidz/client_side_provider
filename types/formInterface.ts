export interface OnBoardingResponse {
  questionsWithAnswers: QuestionsWithAnswers[];
}

export interface QuestionsWithAnswers {
  question: Question;
  answers: Answer[];
}

export interface Question {
  id: string;
  text: string;
  type: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  questionID: string;
  answerText: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserOnboardDetails {
  questionAnswers: QuestionAnswer[];
  dob: string;
  height: string | number;
  heightType: "feet" | "cm";
  weight: number;
  weightType: "Kilograms" | "Pounds";
  location: string;
  gender: string;
}

export interface QuestionAnswer {
  questionID: string;
  answers: string[];
}

export interface UserOnboardDetailsResponse {
  message: string;
  userDetailsId: string;
}

export interface AnswerText {
  text: string;
}

export interface FormRequestInterface {
  questionText: string;
  questionOrder: number;
  questionType: string;
  answers: AnswerText[];
}

export interface FormResponseInterface {
  message: string;
}

export interface InitialData {
  questionText: string;
  questionType: string;
  questionOrder: number;
  answers: AnswerText[];
}

export interface QuestionResponse {
  id: string;
  text: string;
  type: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  answers: AnswerResponse[];
}

export interface AnswerResponse {
  id: string;
  questionID: string;
  answerText: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionnaireInterface {
  total: number;
  page: number;
  limit: number;
  data: QuestionnaireData[];
}

export interface QuestionnaireData {
  id: string;
  questionText: string;
  answerText: string;
  additionalText?: string;
  images: any[];
  createdAt: string;
}
