import ApiFetch from "@/config/api";
import {
  OnBoardingResponse,
  FormRequestInterface,
  FormResponseInterface,
  QuestionResponse,
  UserOnboardDetailsResponse,
  QuestionnaireInterface,
} from "@/types/formInterface";

export const fetchResponse = async ({
  type,
  pageNo,
}: {
  type: string;
  pageNo: number;
}) => {
  const response = await ApiFetch({
    method: "get",
    url: `/questions/questionnaire?type=${type}&pageNo=${pageNo}`,
  });
  console.log(response.data);
  const data: OnBoardingResponse = await response.data;
  console.log(data);
  return data.questionsWithAnswers;
};

export const fetchSpecificQuestions = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    method: "get",
    url: `/admin/questionare/${id}`,
  });
  console.log(response.data);
  const data: QuestionResponse = await response.data;
  console.log(data);
  return data;
};

export const deleteQuestion = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    method: "delete",
    url: `/admin/questionare/${id}`,
  });
  console.log(response.data);
  const data = await response.data;
  console.log(data);
  return data;
};

export const updateQuestion = async ({
  id,
  requestData,
}: {
  id: string;
  requestData: FormRequestInterface;
}) => {
  const response = await ApiFetch({
    method: "patch",
    url: `/admin/questionare/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  console.log(data);
  return data;
};

export const sendQuestionnaireDetails = async ({
  requestData,
}: {
  requestData: FormRequestInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/admin/questionare",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data: FormResponseInterface = await response.data;
  return data;
};

export const fetchUserQuestionnaire = async ({
  userDetailsId,
  limit,
  page,
  type
}: {
  userDetailsId: string;
  page?: number;
  limit?: number;
  type: string
}) => {
  const queryParams = new URLSearchParams();
  if(type) queryParams.append("type", type);
  if(page) queryParams.append("page", page?.toString());
  if(limit) queryParams.append("limit", limit?.toString());

  const response = await ApiFetch({
    method: "get",
    url: `/provider/questionnaire/answers/${userDetailsId}?${queryParams}`,
  });
  console.log(response.data);
  const data: QuestionnaireInterface = await response.data;
  console.log(data);
  return data;
};
