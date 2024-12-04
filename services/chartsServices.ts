import ApiFetch from "@/config/api";
import { CreateEncounterInterface, LabsDataResponse } from "@/types/chartsInterface";

export const createEncounterRequest = async ({
  requestData,
}: {
  requestData: CreateEncounterInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/encounter",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getLabsData = async ({page, limit}: {page: number, limit: number}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/lab/all?page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    }
  });
  console.log(response.data);
  const data: LabsDataResponse = await response.data;
  return data;
};

