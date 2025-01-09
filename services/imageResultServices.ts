import ApiFetch from "@/config/api";
import {
  CreateImageResultInterface,
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
