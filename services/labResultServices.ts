import ApiFetch from "@/config/api";
import { CreateLabResults, LabResultsInterface } from "@/types/labResults";

export const createLabResultRequest = async ({
  requestData,
}: {
  requestData: CreateLabResults;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/lab/results",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getLabResultList = async ({
  providerId,
  limit,
  page
}: {
  providerId: string;
  limit: number;
  page: number;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/lab/results/all?providerId=${providerId}&limit=${limit}&page=${page}`,
    headers: {
      "Content-Type": "application/json",
    }
  });
  console.log(response.data);
  const data: LabResultsInterface = await response.data;
  return data;
};