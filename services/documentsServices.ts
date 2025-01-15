import ApiFetch from "@/config/api";
import { DocumentsInterface } from "@/types/documentsInterface";

export const getDocumentsData = async (userDetailsId: string) => {
  const response = await ApiFetch({
    url: `/provider/documents/all/${userDetailsId}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: DocumentsInterface[] = await response.data;
  return data;
};
