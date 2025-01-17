import ApiFetch from "@/config/api";
import {
  DocumentsMetaDataInterface,
  DocumentsResponseInterface,
} from "@/types/documentsInterface";

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
    url: `/provider/documents/all/${userDetailsId}?${queryParams.toString()}`,
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
