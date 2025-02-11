import ApiFetch from "@/config/api";
import {
  DeleteAvailabiltyInterface,
  ProviderAvailability,
  ProviderAvailabilityRequestInterface,
  UpdateAvailabiltyInterface,
} from "@/types/calendarInterface";

export const providerAvailabilityRequest = async ({
  requestData,
}: {
  requestData: ProviderAvailabilityRequestInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/availability",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const fetchProviderAvaialability = async ({
  providerID,
  startDate,
  endDate,
  page,
  limit,
}: {
  providerID: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    method: "get",
    url: `/provider/availability/${providerID}?${queryParams}`,
  });
  console.log(response.data);
  const data: ProviderAvailability = await response.data;
  console.log(data);
  return data;
};

export const updateProviderAvailabilityRequest = async ({
  providerId,
  requestData,
}: {
  providerId: string;
  requestData: UpdateAvailabiltyInterface;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/availability/${providerId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const deleteProviderAvaialability = async ({
  availabilityID,
}: {
  availabilityID: string;
}) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/availability/${availabilityID}`,
  });
  console.log(response.data);
  const data: DeleteAvailabiltyInterface = await response.data;
  console.log(data);
  return data;
};
