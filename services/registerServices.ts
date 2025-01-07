import ApiFetch from "@/config/api";
import { FetchProviderListInterface, ProviderDetails, UpdateProviderDetails } from "@/types/providerDetailsInterface";
import { ProviderExistsDetails, RegisterInterface, RegisterResponseInterface } from "@/types/registerInterface";

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
    const data:RegisterResponseInterface = await response.data;
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
  providerID
}: {
  requestData: UpdateProviderDetails;
  providerID:string
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

export const fetchProviderDetails = async ({id}:{id: string}) => {
    const response = await ApiFetch({
      method: "get",
      url: `/provider-details/${id}`,
    });
    console.log(response.data);
    const data: ProviderDetails = await response.data;
    console.log(data);
    return data;
};

export const checkProviderExistsOrNot = async ({Authid}:{Authid: string}) => {
    const response = await ApiFetch({
      method: "get",
      url: `/provider/auth/exists/${Authid}`,
    });
    console.log(response.data);
    const data: ProviderExistsDetails = await response.data;
    console.log(data);
    return data;
};

export const fetchProviderListDetails = async ({page, limit}:{page: number, limit: number}) => {
  const response = await ApiFetch({
    method: "get",
    url: `/provider-details/list/all?page=${page}&limit=${limit}`,
  });
  console.log(response.data);
  const data: FetchProviderListInterface = await response.data;
  console.log(data);
  return data;
};
