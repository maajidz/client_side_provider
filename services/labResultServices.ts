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
  userDetailsId = "",
  status = "",
  limit,
  page,
}: {
  providerId: string;
  userDetailsId?: string;
  status?: string;
  limit: number;
  page: number;
}): Promise<LabResultsInterface> => {
  const queryParams = new URLSearchParams({
    providerId,
    userDetailsId,
    status,
    limit: limit.toString(),
    page: page.toString(),
  });

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/lab/results/all?${queryParams.toString()}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: LabResultsInterface = await response.data;
  return data;
};
