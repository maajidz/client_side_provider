import ApiFetch from "@/config/api";
import {
  CreateImageResultInterface,
  ImageResultResponseInterface,
  UploadImageRequestResponse,
  UploadImageResultInterface,
} from "@/types/imageResults";

export const uploadImageRequest = async ({
  requestData,
}: {
  requestData: UploadImageResultInterface;
}) => {
  const formData = new FormData();

  requestData.images.forEach((image) => {
    formData.append("images", image);
  });

  formData.append("userDetailsId", requestData.userDetailsId);

  const response = await ApiFetch({
    method: "POST",
    url: "/provider/images/results/upload-images",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  console.log(response.data);
  const data: UploadImageRequestResponse = await response.data;
  return data;
};

export const createImageResultRequest = async ({
  requestData,
}: {
  requestData: CreateImageResultInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/images/results",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getImageResults = async ({
  providerId,
  userDetailsId,
  limit,
  page,
  status,
}: {
  providerId: string;
  userDetailsId?: string;
  limit: number;
  page: number;
  status?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (userDetailsId) {
    queryParams.append("userDetailsId", userDetailsId);
  }
  if (page) {
    queryParams.append("page", page.toString());
  }
  if (limit) {
    queryParams.append("limit", limit.toString());
  }
  if (status) {
    queryParams.append("status", status);
  }

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/images/results/${providerId}?${queryParams}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: ImageResultResponseInterface = await response.data;
  return data;
};
