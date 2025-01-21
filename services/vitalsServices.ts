import ApiFetch from "@/config/api";
import {
  CreateVitalType,
  UpdateVitalType,
  VitalsResponseInterface,
} from "@/types/vitalsInterface";

export const createVitalData = async (requestData: CreateVitalType) => {
  const response = await ApiFetch({
    url: `/provider/vitals`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const getVitalsData = async (searchParams: {
  providerId?: string | undefined;
  userDetailsId?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}) => {
  const queryParams = new URLSearchParams();

  const { limit, page, providerId, userDetailsId } = searchParams;

  if (userDetailsId) queryParams.append("userDetailsId", userDetailsId);
  if (providerId) queryParams.append("providerId", providerId);
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    url: `/provider/vitals?${queryParams}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: VitalsResponseInterface = await response.data;
  return data;
};

export const updateVitalData = async ({
  requestData,
  id,
}: {
  requestData: UpdateVitalType;
  id: string;
}) => {
  const response = await ApiFetch({
    url: `/provider/vitals/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const deleteVitalData = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    url: `/provider/vitals/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};

