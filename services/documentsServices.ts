import ApiFetch from "@/config/api";
import {
  DocumentsMetaDataInterface,
  DocumentsResponseInterface,
  UploadDocumentType,
} from "@/types/documentsInterface";

export const uploadDocument = async ({
  requestData,
}: {
  requestData: UploadDocumentType;
}) => {
  const formData = new FormData();

  formData.append("document_type", requestData.document_type);
  formData.append("provderId", requestData.provderId);
  formData.append("date", requestData.date);
  formData.append("file_for_review", requestData.file_for_review?.toString() || "false");
  formData.append("userDetailsId", requestData.userDetailsId);

  // Append each file in the `images` array
  requestData.images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await ApiFetch({
    url: "/provider/documents/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });

  const data = await response.data;
  return data;
};

export const getDocumentsData = async ({
  userDetailsId,
  reviewerId,
  status,
}: {
  userDetailsId: string;
  reviewerId?: string;
  status?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (reviewerId) queryParams.append("reviewerId", reviewerId);
  if (status) queryParams.append("status", status);

  const response = await ApiFetch({
    url: `/provider/documents/all/${userDetailsId}?${queryParams}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: DocumentsResponseInterface = await response.data;
  return data;
};

export const getDocumentMetaData = async ({
  documentId,
  type,
}: {
  documentId: string;
  type: string;
}) => {
  const response = await ApiFetch({
    url: `/provider/documents/metadata/${documentId}?type=${type}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: DocumentsMetaDataInterface = await response.data;
  return data;
};
