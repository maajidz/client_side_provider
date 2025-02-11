import ApiFetch from "@/config/api";
import {
  CreateSocialHistoryType,
  SocialHistoryResponseInterface,
  UpdateSocialHistoryType,
} from "@/types/socialHistoryInterface";

export const createSocialHistory = async ({
  requestData,
}: {
  requestData: CreateSocialHistoryType;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/social-history",
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const getSocialHistory = async ({
  userDetailsId,
  page,
  limit,
}: {
  userDetailsId: string;
  page?: number;
  limit?: number;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/social-history/${userDetailsId}?page=${page}&limit=${limit}`,
  });

  const data: SocialHistoryResponseInterface = await response.data;
  return data;
};

export const updateSocialHistory = async ({
  requestData,
  id,
}: {
  requestData: UpdateSocialHistoryType;
  id: string;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/social-history/${id}`,
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const deleteSocialHistory = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/social-history/${id}`,
  });

  const data = await response.data;
  return data;
};
