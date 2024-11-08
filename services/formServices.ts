import ApiFetch from "@/config/api";
import {
  OnBoardingResponse,
  FormRequestInterface,
  FormResponseInterface,
  QuestionResponse,
  UserOnboardDetailsResponse,
} from "@/types/formInterface";

export const fetchResponse = async ({type, pageNo}:{type:string, pageNo: number}) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/questions/questionnaire?type=${type}&pageNo=${pageNo}`,
    });
    console.log(response.data);
    const data: OnBoardingResponse = await response.data;
    console.log(data);
    return data.questionsWithAnswers;
  } catch (error) {
    console.error("Error fetching response", error);
    return null;
  }
};

export const fetchSpecificQuestions = async ({id}:{id:string}) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/admin/questionare/${id}`,
    });
    console.log(response.data);
    const data: QuestionResponse = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
    return null;
  }
};

export const deleteQuestion = async ({id}:{id:string}) => {
  try {
    const response = await ApiFetch({
      method: "delete",
      url: `/admin/questionare/${id}`,
    });
    console.log(response.data);
    const data = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
    return null;
  }
}

export const updateQuestion = async ({id, requestData}:{id:string, requestData: FormRequestInterface;}) => {
  try {
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
  } catch (error) {
    console.error("Error fetching response", error);
    return null;
  }
}

export const sendQuestionnaireDetails = async ({
  requestData,
}: {
  requestData: FormRequestInterface;
}) => {
  try {
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
  } catch (error) {
    console.error("Error submitting form:", error);
    return null;
  }
};


