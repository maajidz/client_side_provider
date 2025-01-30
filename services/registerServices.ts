import ApiFetch from "@/config/api";
import {
  FetchProviderListInterface,
  ProviderDetails,
  UpdateProviderDetails,
} from "@/types/providerDetailsInterface";
import {
  ChangePasswordInterface,
  ProviderExistsDetails,
  RegisterInterface,
  RegisterResponseInterface,
} from "@/types/registerInterface";

export const registerProvider = async ({
  requestData,
}: {
  requestData: RegisterInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/auth/register",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data: RegisterResponseInterface = await response.data;
  return data;
};

export const sendProviderDetails = async ({
  requestData,
}: {
  requestData: ProviderDetails;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider-details",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const updateProviderDetails = async ({
  requestData,
  providerID,
}: {
  requestData: UpdateProviderDetails;
  providerID: string;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider-details/${providerID}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const fetchProviderDetails = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    method: "get",
    url: `/provider-details/${id}`,
  });
  console.log(response.data);
  const data: ProviderDetails = await response.data;
  console.log(data);
  return data;
};

export const checkProviderExistsOrNot = async ({
  Authid,
}: {
  Authid: string;
}) => {
  const response = await ApiFetch({
    method: "get",
    url: `/provider/auth/exists/${Authid}`,
  });
  console.log(response.data);
  const data: ProviderExistsDetails = await response.data;
  console.log(data);
  return data;
};

export const fetchProviderListDetails = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await ApiFetch({
    method: "get",
    url: `/provider-details/list/all?page=${page}&limit=${limit}`,
  });

  const data: FetchProviderListInterface = await response.data;
  console.log(data);
  return data;
};

export const searchProviders = async ({
  name,
  page,
  limit
}: {
  name: string;
  page?: number;
  limit? : number;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (name) queryParams.append("q", name);
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    const response = await ApiFetch({
      method: "get",
      url: `/provider-details/search/name?${queryParams}`,
    });

    const data: FetchProviderListInterface = await response.data;
    return data;
  } catch (error) {
    console.log("Error fetching response", error);
    return null;
  }
};

/*
 * Change Password
 */
export const changeProviderPassword = async ({
  requestData,
  providerId,
}: {
  requestData: ChangePasswordInterface;
  providerId: string;
}) => {
  const response = await ApiFetch({
    url: `/provider/auth/change-password/${providerId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};
