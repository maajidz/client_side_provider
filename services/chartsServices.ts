import ApiFetch from "@/config/api";
import { CreateEncounterInterface, CreateEncounterResponseInterface, LabsDataResponse, LabsRequestData, SOAPInterface, UserEncounterInterface } from "@/types/chartsInterface";

export const createEncounterRequest = async ({
  requestData,
}: {
  requestData: CreateEncounterInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/encounters",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data: CreateEncounterResponseInterface = await response.data;
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

export const createLabs = async ({
  requestData,
}: {
  requestData: LabsRequestData;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/lab",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getUserEncounterDetails = async ({
  encounterId,
}: {
  encounterId: string;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/encounters/${encounterId}?idtype=id&page=1&limit=10`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: UserEncounterInterface = await response.data;
  return data.data;
};

export const createSOAPChart = async ({
  requestData,
}: {
  requestData: SOAPInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/charts",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};