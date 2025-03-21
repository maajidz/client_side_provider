import ApiFetch from "@/config/api";
import { CreateLabResults, LabResultsInterface } from "@/types/labResults";

// Add a new type for the upload lab files request
export interface UploadLabFilesInterface {
  files: File[];
  userDetailsId: string;
}

// Add a new method for uploading lab result files
export const uploadLabFilesRequest = async ({
  requestData,
}: {
  requestData: UploadLabFilesInterface;
}) => {
  const formData = new FormData();

  requestData.files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("userDetailsId", requestData.userDetailsId);

  const response = await ApiFetch({
    method: "POST",
    url: "/provider/lab/results/upload-files",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  
  const data: string[] = await response.data;
  return data;
};

export const createLabResultRequest = async ({
  requestData,
}: {
  requestData: CreateLabResults;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/lab/results",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getLabResultList = async ({
  providerId,
  userDetailsId = "",
  status = "",
  limit,
  page,
}: {
  providerId: string;
  userDetailsId?: string;
  status?: string;
  limit: number;
  page: number;
}): Promise<LabResultsInterface> => {
  const queryParams = new URLSearchParams({
    providerId,
    userDetailsId,
    status,
    limit: limit.toString(),
    page: page.toString(),
  });

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/lab/results/all?${queryParams.toString()}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: LabResultsInterface = await response.data;
  return data;
};
