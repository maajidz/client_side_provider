import ApiFetch from "@/config/api";
import { AddPrimaryCareInterface } from "@/types/primaryCareInterface";

// * Add Primary Care Provider
export const addPrimaryCarePhysician = async (
  requestData: AddPrimaryCareInterface
) => {
  const response = ApiFetch({
    url: "/provider/primary-care",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = (await response).data;
  return data;
};

export const deletePrimaryCarePhysician = async ({ id }: { id: string }) => {
  const response = ApiFetch({
    url: `/provider/primary-care/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await response).data;
  return data;
};

