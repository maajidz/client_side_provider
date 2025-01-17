import ApiFetch from "@/config/api";
import {
  CreateInjectionType,
  CreateVaccineInterface,
  InjectionsResponseInterface,
  InjectionsSearchParamsType,
  VaccinesResponseInterface,
  VaccinesSearchParamsType,
} from "@/types/injectionsInterface";

export const createInjectionOrder = async ({
  requestBody,
}: {
  requestBody: CreateInjectionType;
}) => {
  const response = await ApiFetch({
    url: "/injections/injection",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  });

  const data = await response.data;
  return data;
};

export const getInjectionsData = async (params: InjectionsSearchParamsType) => {
  const queryParams = new URLSearchParams();

  const { userDetailsId, providerId, status, page = 1, limit = 10 } = params;

  if (userDetailsId) queryParams.append("userDetailsId", userDetailsId);
  if (providerId) queryParams.append("providerId", providerId);
  if (status) queryParams.append("status", status);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    url: `/injections/injections?${queryParams}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: InjectionsResponseInterface = await response.data;
  return data;
};

/**
 * * Vaccines API methods
 */
export const createVaccineOrder = async ({
  requestData,
}: {
  requestData: CreateVaccineInterface;
}) => {
  const response = await ApiFetch({
    url: "/injections/vaccine",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const getVaccinesData = async (params: VaccinesSearchParamsType) => {
  const queryParams = new URLSearchParams();

  const { userDetailsId, providerId, status, page = 1, limit = 10 } = params;

  if (userDetailsId) queryParams.append("userDetailsId", userDetailsId);
  if (providerId) queryParams.append("providerId", providerId);
  if (status) queryParams.append("status", status);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    url: `/injections/vaccines?${queryParams}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: VaccinesResponseInterface = await response.data;
  return data;
};
