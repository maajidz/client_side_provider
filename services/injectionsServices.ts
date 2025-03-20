import ApiFetch from "@/config/api";
import {
  CreateInjectionInterface,
  CreateInjectionType,
  CreateVaccineInterface,
  InjectionsResponse,
  InjectionsResponseInterface,
  InjectionsSearchParamsType,
  InjectionsTypeResponseInterface,
  UpdateInjectionInterface,
  VaccinesResponseInterface,
  VaccinesSearchParamsType,
  VaccineTypesResponseInterface,
} from "@/types/injectionsInterface";

export const createInjectionOrder = async ({
  requestBody,
}: {
  requestBody: CreateInjectionType;
}) => {
  const response = await ApiFetch({
    url: "/injections/injection-order",
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
    url: `/injections/injections-order?${queryParams}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: InjectionsResponseInterface = await response.data;
  return data;
};

export const deleteInjectionOrder = async ({
  injectionId,
}: {
  injectionId: string;
}) => {
  const response = await ApiFetch({
    url: `/injections/injection-order/${injectionId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
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

export const getVaccinesType = async ({
  search,
  limit,
}: {
  search: string;
  limit: number;
}) => {
  const response = await ApiFetch({
    url: `/injections/vaccine/type?search=${search}&limit=${limit}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: VaccineTypesResponseInterface = await response.data;
  return data;
};

export const deleteVaccineOrder = async ({
  vaccineOrderId,
}: {
  vaccineOrderId: string;
}) => {
  const response = await ApiFetch({
    url: `/injections/vaccine/${vaccineOrderId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};

export const createInjection = async ({
  requestBody,
}: {
  requestBody: CreateInjectionInterface;
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

export const getInjection = async ({
  page,
  limit,
  providerId,
  userDetailsId,
  status,
  name,
}: {
  page: number;
  limit: number;
  providerId?: string;
  userDetailsId?: string;
  status?: string;
  name?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (providerId) queryParams.append("providerId", providerId);
  if (userDetailsId) queryParams.append("userDetailsId", userDetailsId);
  if (status) queryParams.append("status", status);
  if (name) queryParams.append("name", name);

  const response = await ApiFetch({
    url: `/injections/injection?${queryParams}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: InjectionsResponse = await response.data;
  return data;
};

export const getInjectionsType = async ({ search }: { search: string }) => {
  const response = await ApiFetch({
    url: `/injections/injection/type?search=${search}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: InjectionsTypeResponseInterface = await response.data;
  return data;
};

export const deleteInjection = async ({
  injectionId,
}: {
  injectionId: string;
}) => {
  const response = await ApiFetch({
    url: `/injections/injection/${injectionId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};

export const updateInjection = async ({
  requestBody,
  id,
}: {
  id: string;
  requestBody: UpdateInjectionInterface;
}) => {
  const response = await ApiFetch({
    url: `/injections/injection/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  });

  const data = await response.data;
  return data;
};
